from bs4 import BeautifulSoup


with open("./templates/index.html") as f:
    soup = BeautifulSoup(f, features="html.parser")

for img in soup.find_all("img"):
    src = img["src"].lstrip(".")
    img["src"] = "{{ url_for('static', filename='" + src + "')}}"

with open("res.html", "w") as f:
    f.write(str(soup))