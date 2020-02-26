import wikipediaapi
import html2markdown
from tomd import Tomd

wiki_wiki = wikipediaapi.Wikipedia('en')
wiki_html = wikipediaapi.Wikipedia(
    language='en',
    extract_format=wikipediaapi.ExtractFormat.HTML
)
page = wiki_wiki.page(
    'List_of_unsolved_problems_in_mathematics')
html = wiki_html.page('List_of_unsolved_problems_in_mathematics')


def print_sections(sections, level=0):
    for s in sections:
        print("%s: %s - %s" %
              ("*" * (level + 1), s.title, s.text[0:40]))
        print_sections(s.sections, level + 1)


def print_categories(page):
    categories = page.categories
    for title in sorted(categories.keys()):
        print("%s: %s" % (title, categories[title]))


def print_links(page):
    links = page.links
    for title in sorted(links.keys()):
        print("%s: %s" % (title, links[title]))


print_sections(page.sections)

print_categories(page)

print_categories(page)

# markdown = Tomd(html.text).markdown
# print(markdown)
