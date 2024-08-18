from wordcloud import WordCloud
import matplotlib.pyplot as plt

# Przykładowy tekst do wygenerowania chmury tagów
text = """
JavaScript D3.js Visualization SVG HTML5 CSS3 Mask Cloud Data Python WordCloud
"""

# Generowanie chmury tagów
wordcloud = WordCloud(width=800, height=600, background_color='white').generate(text)

# Zapisanie chmury tagów jako obraz PNG
wordcloud.to_file('wordcloud.png')

# Wyświetlenie chmury tagów
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis('off')
plt.show()
