import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("datasets/skincare_dataset/cosmetics.csv")

skin_counts = {
    "Combination": df["Combination"].sum(),
    "Dry": df["Dry"].sum(),
    "Normal": df["Normal"].sum(),
    "Oily": df["Oily"].sum(),
    "Sensitive": df["Sensitive"].sum()
}

plt.figure(figsize=(8,5))
plt.bar(skin_counts.keys(), skin_counts.values())

plt.title("Jumlah Produk Berdasarkan Jenis Kulit")
plt.xlabel("Jenis Kulit")
plt.ylabel("Jumlah Produk")

plt.tight_layout()
plt.show()