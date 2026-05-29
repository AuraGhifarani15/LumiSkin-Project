import pandas as pd

df = pd.read_csv("datasets/skincare_dataset/cosmetics.csv")

print(df.columns)

print("\n")

print(df.iloc[0])