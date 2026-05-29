import pandas as pd
from collections import Counter

df = pd.read_csv("datasets/skincare_dataset/cosmetics.csv")

all_ingredients = []

for ingredients in df["Ingredients"]:
    ingredient_list = [i.strip() for i in ingredients.split(",")]
    all_ingredients.extend(ingredient_list)

ingredient_counts = Counter(all_ingredients)

print("Top 20 Ingredients:")
for ingredient, count in ingredient_counts.most_common(20):
    print(f"{ingredient}: {count}")