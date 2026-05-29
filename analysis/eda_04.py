import pandas as pd

df = pd.read_csv("datasets/skincare_dataset/cosmetics.csv")

avg_price = df.groupby("Label")["Price"].mean().sort_values(ascending=False)

print(avg_price)