import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("datasets/skincare_dataset/cosmetics.csv")

label_counts = df["Label"].value_counts()

plt.figure(figsize=(8,5))
label_counts.plot(kind="bar")

plt.title("Distribusi Kategori Produk Skincare")
plt.xlabel("Kategori Produk")
plt.ylabel("Jumlah Produk")

plt.tight_layout()
plt.show()