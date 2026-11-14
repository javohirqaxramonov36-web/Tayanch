"""SAT Math kursi uchun yopiq grammatika va Markdown tekshiruvi."""
import ast
from decimal import Decimal
import json
import re
import resource
import sys
from urllib.parse import urlsplit

# Bitta ishchi jarayon uchun OS va Node tomonidan mustaqil chegaralar.
resource.setrlimit(resource.RLIMIT_CPU, (12, 12))
if sys.platform == "linux":
    resource.setrlimit(resource.RLIMIT_AS, (384 * 1024**2,) * 2)

from markdown_it import MarkdownIt
import sympy as sp

if sp.__version__ != "1.14.0":
    sys.exit(2)

SYMBOLS = {name: sp.Symbol(name, real=True) for name in ("x", "y", "m", "b", "a", "t", "n")}
NUMBER = re.compile(r"(?:\d{1,16}(?:\.\d{1,16})?|\.\d{1,16})\Z", re.ASCII)
RATIONAL = re.compile(r"(-?)(?:(\d{1,16})/(\d{1,16})|(\d{1,16}(?:\.\d{1,16})?|\.\d{1,16}))\Z", re.ASCII)
COMPARE = {ast.Eq: sp.Eq, ast.Lt: sp.Lt, ast.LtE: sp.Le, ast.Gt: sp.Gt, ast.GtE: sp.Ge}
INFINITELY_MANY = object()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def rational(text):
    match = RATIONAL.fullmatch(text) if isinstance(text, str) else None
    require(match is not None, "SPR: aniq son yoki kasr kerak")
    sign, numerator, denominator, decimal = match.groups()
    if decimal is not None:
        return sp.Rational(*Decimal(sign + decimal).as_integer_ratio())
    require(int(denominator) != 0, "SPR: maxraj nol")
    return sp.Rational(int(sign + numerator), int(denominator))


def expression(text, comparisons=()):
    require(isinstance(text, str) and 0 < len(text) <= 160, "check: ifoda uzunligi xato")
    text = text.strip()
    require(re.fullmatch(r"[a-z0-9. (),+*/<>=-]+", text, re.ASCII), "check: ruxsatsiz belgi")
    try:
        tree = ast.parse(text, mode="eval")
    except SyntaxError:
        raise ValueError("check: ifoda sintaksisi xato") from None
    require(sum(1 for _ in ast.walk(tree)) <= 60, "check: ifoda juda murakkab")

    def scalar(node):
        if isinstance(node, ast.Constant):
            token = ast.get_source_segment(text, node)
            require(NUMBER.fullmatch(token), "check: oddiy butun yoki o‘nli son kerak")
            return sp.Rational(*Decimal(token).as_integer_ratio())
        if isinstance(node, ast.Name) and node.id in SYMBOLS:
            return SYMBOLS[node.id]
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
            value = scalar(node.operand)
            return -value if isinstance(node.op, ast.USub) else value
        if isinstance(node, ast.BinOp):
            left, right = scalar(node.left), scalar(node.right)
            if isinstance(node.op, ast.Add):
                return left + right
            if isinstance(node.op, ast.Sub):
                return left - right
            if isinstance(node.op, ast.Mult):
                require(not left.free_symbols or not right.free_symbols, "check: ko‘paytma chiziqli bo‘lishi kerak")
                return left * right
            if isinstance(node.op, ast.Div):
                require(right.is_Rational and right != 0, "check: maxraj noldan farqli ratsional son bo‘lishi kerak")
                return left / right
            if isinstance(node.op, ast.Pow):
                require(isinstance(node.right, ast.Constant) and type(node.right.value) is int
                        and 0 <= node.right.value <= 3 and not left.free_symbols,
                        "check: daraja faqat doimiy son uchun 0–3")
                # Takror darajaga ko‘tarish katta butun sonlarni hosil qilmasin.
                require(max(int(left.p).bit_length(), int(left.q).bit_length()) <= 128,
                        "check: daraja asosi juda katta")
                return left ** node.right.value
        raise ValueError("check: ruxsatsiz amal yoki o‘zgaruvchi")

    node = tree.body
    if isinstance(node, ast.Tuple):
        require(1 < len(node.elts) <= 4, "check: kortejda 2–4 qiymat kerak")
        return sp.Tuple(*(scalar(part) for part in node.elts))
    if isinstance(node, ast.Compare):
        require(len(node.ops) <= 2 and all(type(op) in comparisons for op in node.ops),
                "check: ruxsatsiz taqqoslash")
        values = [scalar(part) for part in [node.left, *node.comparators]]
        return sp.And(*(COMPARE[type(op)](left, right)
                        for op, left, right in zip(node.ops, values, values[1:])))
    return scalar(node)


def relation(text, comparisons=tuple(COMPARE)):
    # Muallif matematik ifodada "=" ishlatishi mumkin.
    require(isinstance(text, str), "check: munosabat matn bo‘lishi kerak")
    return expression(re.sub(r"(?<![<>=])=(?!=)", "==", text), comparisons)


def linear(value, variables):
    require(value.free_symbols <= set(variables), "check: ortiqcha o‘zgaruvchi")
    poly = sp.Poly(value, *variables)
    require(poly.total_degree() <= 1, "check: chiziqli ifoda kerak")
    return poly


def variables(check, count):
    names = check.get("variables")
    require(isinstance(names, list) and len(names) == count and
            all(isinstance(name, str) and name in SYMBOLS for name in names) and
            len(set(names)) == count, "check: o‘zgaruvchilar xato")
    return [SYMBOLS[name] for name in names]


def solve(check, spr):
    require(isinstance(check, dict), "check: obyekt kerak")
    kind = check.get("kind")
    fields = {"expression": {"expression"}, "linear": {"equations", "variables", "target"},
              "inequality": {"relations", "variables"}, "relation": {"expression", "variables"},
              "alternatives": {"expressions"}}
    require(isinstance(kind, str) and kind in fields and set(check) == fields[kind] | {"kind"},
            "check: noma’lum tur yoki maydon")
    if kind == "expression":
        return expression(check["expression"])
    if kind == "alternatives":
        items = check["expressions"]
        require(spr and isinstance(items, list) and 2 <= len(items) <= 4, "check: 2–4 ta SPR ifodasi kerak")
        values = [expression(item) for item in items]
        require(all(value.is_Rational for value in values) and len(set(values)) == len(values),
                "check: takrorsiz ratsional natijalar kerak")
        return sp.FiniteSet(*values)
    if kind == "relation":
        return halfplane(check["expression"], variables(check, 2))
    if kind == "inequality":
        (symbol,) = variables(check, 1)
        items = check["relations"]
        require(isinstance(items, list) and 1 <= len(items) <= 3, "check: 1–3 tengsizlik kerak")
        return sp.Intersection(*(interval(item, symbol) for item in items))

    names = check["variables"]
    require(isinstance(names, list) and 1 <= len(names) <= 2, "check: 1–2 o‘zgaruvchi kerak")
    symbols = variables(check, len(names))
    equations = check["equations"]
    require(isinstance(equations, list) and 1 <= len(equations) <= 3, "check: 1–3 tenglama kerak")
    polys = []
    inconsistent = False
    for item in equations:
        equation = relation(item, (ast.Eq,))
        if equation is sp.false:
            inconsistent = True
        elif equation is not sp.true:
            require(isinstance(equation, sp.Equality), "check: tenglama kerak")
            polys.append(linear(equation.lhs - equation.rhs, symbols).as_expr())
    target = expression(check["target"])
    require(target.free_symbols <= set(symbols), "check: target o‘zgaruvchisi noma’lum")
    if inconsistent:
        return sp.S.EmptySet
    solutions = sp.linsolve(polys or [sp.S.Zero], symbols)
    if solutions is sp.S.EmptySet:
        return solutions
    (solution,) = solutions
    result = target.subs(dict(zip(symbols, solution)), simultaneous=True)
    if result.free_symbols:
        if isinstance(result, sp.Tuple):
            return INFINITELY_MANY
        return sp.S.Reals
    return result


def interval(text, symbol):
    require(isinstance(text, str), "check: tengsizlik matn bo‘lishi kerak")
    value = relation(text, (ast.Lt, ast.LtE, ast.Gt, ast.GtE))
    for item in value.args if isinstance(value, sp.And) else (value,):
        if item in (sp.true, sp.false):
            continue
        require(getattr(item, "is_Relational", False), "check: tengsizlik kerak")
        linear(item.lhs - item.rhs, [symbol])
    return value.as_set()


def halfplane(text, symbols):
    require(isinstance(text, str), "check: munosabat matn bo‘lishi kerak")
    value = relation(text)
    require(getattr(value, "is_Relational", False), "check: tekislikda chiziq yoki yarim tekislik kerak")
    poly = linear(value.lhs - value.rhs, symbols)
    if isinstance(value, (sp.Ge, sp.Gt)):
        poly = -poly
    scale = poly.LC() if isinstance(value, sp.Equality) else abs(poly.LC())
    kind = "=" if isinstance(value, sp.Equality) else "<" if isinstance(value, (sp.Lt, sp.Gt)) else "<="
    return kind, poly.as_expr() / scale


def equivalent(left, right):
    if isinstance(left, sp.Tuple):
        return isinstance(right, sp.Tuple) and len(left) == len(right) and all(
            equivalent(a, b) for a, b in zip(left, right))
    if isinstance(left, sp.Expr) and isinstance(right, sp.Expr):
        return sp.expand(left - right) == 0
    return left == right


def mcq(check, correct, choices, key):
    def choice(text):
        if text == "no solution":
            return sp.S.EmptySet
        if text == "infinitely many solutions":
            return INFINITELY_MANY if correct is INFINITELY_MANY else sp.S.Reals
        if text == "all real numbers":
            return sp.S.Reals
        if check["kind"] == "inequality":
            return interval(text, variables(check, 1)[0])
        if check["kind"] == "relation":
            return halfplane(text, variables(check, 2))
        return expression(text)

    values = [choice(text.strip().lower()) for text in choices]
    matches = [i for i, value in enumerate(values) if equivalent(correct, value)]
    require(matches == [key], "MCQ: yagona isbotlangan variant kalitga mos bo‘lishi kerak")
    require(not any(equivalent(a, b) for i, a in enumerate(values) for b in values[i + 1:]),
            "MCQ: qiymati bir xil variantlar bor")


def spr_form(value, text):
    parsed = rational(text)
    limit = 6 if text.startswith("-") else 5
    if len(text) > limit:
        return False
    if parsed == value:
        return True
    if "." not in text or "/" in text or value == 0 or text.startswith("-") != (value < 0):
        return False
    unsigned = text.lstrip("-")
    whole, fraction = unsigned.split(".")
    places = 4 - len(whole)
    if places < 1 or len(fraction) != places:
        return False
    factor = 10 ** places
    scaled = abs(value) * factor
    for integer in (int(scaled), int(scaled + sp.S.Half)):
        before, after = divmod(integer, factor)
        prefix = str(before) if before or whole else ""
        if unsigned == f"{prefix}.{after:0{places}d}":
            return True
    return False


def math_check(item):
    check = item["check"]
    correct = solve(check, item["type"] == "spr")
    if item["type"] == "mcq":
        mcq(check, correct, item["choices"], item["key"])
        return

    exact = [rational(text) for text in item["exact"]]
    solutions = set(correct) if isinstance(correct, sp.FiniteSet) else {correct}
    require(set(exact) == solutions and len(set(exact)) == len(exact),
            "SPR: aniq javob SymPy natijasiga mos emas")
    accepted = item["accepted"]
    matches = [[spr_form(value, text) for value in exact] for text in accepted]
    require(all(any(row) for row in matches) and all(any(column) for column in zip(*matches)),
            "SPR: accepted qiymatlari aniq javoblarning ruxsat etilgan shakllariga mos emas")


MARKDOWN = MarkdownIt("commonmark", {"html": True, "maxNesting": 20})
# Xavfli URL ham token bo‘lib chiqsin, shunda jim o‘tib ketmaydi.
MARKDOWN.validateLink = lambda _url: True


def markdown_check(text, lesson=False):
    tokens = MARKDOWN.parse(text)
    images = []

    def inspect(items):
        for token in items:
            require(token.type not in ("html_block", "html_inline"), "Markdown: xom HTML ruxsat etilmaydi")
            if token.type == "link_open":
                url = token.attrGet("href")
                parts = urlsplit(url)
                require((parts.scheme == "https" and parts.hostname and not parts.username and not parts.password)
                        or url.startswith("#"), "Markdown: faqat HTTPS havola yoki #anchor mumkin")
            if token.type == "image":
                alt = "".join(child.content for child in token.children if child.type == "text").strip()
                require(lesson and len(alt) >= 5, "Markdown: rasm faqat darsda va tavsif bilan bo‘lishi kerak")
                images.append(token.attrGet("src"))
            if token.children:
                inspect(token.children)

    inspect(tokens)
    if lesson:
        headings = [(i, token.tag, tokens[i + 1].content.strip()) for i, token in enumerate(tokens)
                    if token.type == "heading_open" and token.level == 0]
        stages = [(i, title) for i, tag, title in headings if tag == "h2"]
        require([title for _, title in stages] == ["Foundation", "Core", "Advanced"],
                "lesson.md: Foundation, Core, Advanced H2 sarlavhalari tartibda kerak")
        for (start, title), (end, _) in zip(stages, [*stages[1:], (len(tokens), "")]):
            sections = [(i, heading) for i, tag, heading in headings if tag == "h3" and start < i < end]
            expected = ["Theory", "Nazariya (UZ)", "Examples"] if title == "Foundation" else ["Theory", "Examples"]
            require([heading for _, heading in sections] == expected, "lesson.md: nazariya yoki misollar bo‘limi xato")
            for (i, section), (next_i, _) in zip(sections, [*sections[1:], (end, "")]):
                if section == "Examples":
                    examples = [j for j, tag, _ in headings if tag == "h4" and i < j < next_i]
                    require(2 <= len(examples) <= 3, "lesson.md: bosqichda 2–3 ta H4 misol kerak")
                    spans = zip(examples, [*examples[1:], next_i])
                else:
                    spans = [(i, next_i)]
                for a, b in spans:
                    require(any(t.type == "paragraph_open" for t in tokens[a + 3:b]),
                            "lesson.md: nazariya yoki yechilgan misol matni bo‘sh")
        rendered = []
        for (start, title), (end, _) in zip(stages, [*stages[1:], (len(tokens), "")]):
            body = tokens[start + 3:end]
            if title == "Foundation":
                uz = next(i for i, t in enumerate(body) if t.type == "heading_open" and t.tag == "h3" and t.level == 0 and body[i + 1].content == "Nazariya (UZ)")
                examples = next(i for i, t in enumerate(body) if t.type == "heading_open" and t.tag == "h3" and t.level == 0 and body[i + 1].content == "Examples")
                render = lambda part: MARKDOWN.renderer.render(part, MARKDOWN.options, {})
                html = render(body[:uz]) + '<div lang="uz">' + render(body[uz:examples]) + '</div>' + render(body[examples:])
            else:
                html = MARKDOWN.renderer.render(body, MARKDOWN.options, {})
            rendered.append(html)
        return {"images": images, "sections": rendered}
    return {}


def tekshir(item):
    try:
        if item["type"] == "lesson":
            return markdown_check(item["text"], lesson=True)
        math_check(item)
        for text in item["texts"]:
            markdown_check(text)
        return {}
    except (ValueError, TypeError, ArithmeticError, sp.PolynomialError, RecursionError) as error:
        # Kutubxona xatolari xususiy ifodani o‘z ichiga olishi mumkin.
        message = str(error) if type(error) is ValueError and str(error).startswith(
            ("check:", "SPR:", "MCQ:", "Markdown:", "lesson.md:")) else "SymPy yoki Markdown tekshiruvi bajarilmadi"
        return {"error": message}


if __name__ == "__main__":
    try:
        print(json.dumps([tekshir(item) for item in json.load(sys.stdin)]))
    except Exception:
        sys.exit(2)
