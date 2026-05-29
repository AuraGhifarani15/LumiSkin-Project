import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

st.set_page_config(layout="wide", page_title="Skincare Product Analysis")

st.title("Skincare Product Analysis Dashboard")

# Load the dataset
@st.cache_data
def load_data():
    df = pd.read_csv("datasets/skincare_dataset/cosmetics.csv")
    return df

df = load_data()

st.subheader("1. Distribution of Skincare Product Categories")
label_counts = df["Label"].value_counts()

fig1, ax1 = plt.subplots(figsize=(10, 6))
label_counts.plot(kind="bar", ax=ax1)
ax1.set_title("Distribution of Skincare Product Categories")
ax1.set_xlabel("Product Category")
ax1.set_ylabel("Number of Products")
st.pyplot(fig1)

st.write("**Insight:** Moisturizer is the most dominant product category with 298 products, while Sun Protect has the least with 170 products.")

st.subheader("2. Distribution of Products by Skin Type")
skin_counts = {
    "Combination": df["Combination"].sum(),
    "Dry": df["Dry"].sum(),
    "Normal": df["Normal"].sum(),
    "Oily": df["Oily"].sum(),
    "Sensitive": df["Sensitive"].sum()
}

fig2, ax2 = plt.subplots(figsize=(10, 6))
ax2.bar(skin_counts.keys(), skin_counts.values())
ax2.set_title("Number of Products by Skin Type")
ax2.set_xlabel("Skin Type")
ax2.set_ylabel("Number of Products")
st.pyplot(fig2)

st.write("**Insight:** Products for Combination skin are the most numerous (966 products), while products for Sensitive skin are the least (756 products).")

st.subheader("3. Product Price Characteristics")
st.write(f"Average Price: {df['Price'].mean():.2f}")
st.write(f"Minimum Price: {df['Price'].min()}")
st.write(f"Maximum Price: {df['Price'].max()}")

st.write("**Insight:** The average price of skincare products in the dataset is 55.58, with a price range from 3 to 370.")

st.subheader("4. Average Price per Product Category")
avg_price_per_category = df.groupby("Label")["Price"].mean().sort_values(ascending=False)
st.dataframe(avg_price_per_category)

st.write("**Insight:** The Treatment category has the highest average price (79.18), while the Cleanser category has the lowest (32.60).")

st.subheader("5. Distribution of Product Ratings")

fig3, ax3 = plt.subplots(figsize=(10, 6))
ax3.hist(df["Rank"], bins=20)
ax3.set_title("Distribution of Product Ratings")
ax3.set_xlabel("Rating")
ax3.set_ylabel("Number of Products")
st.pyplot(fig3)

st.write("**Insight:** The average product rating is 4.15 out of 5, indicating that most products have positive reviews. The distribution also shows a majority of products with high ratings (3.5-5.0).")

st.subheader("Products with Rank 0 (Unrated)")
st.dataframe(df[df["Rank"] == 0][["Brand", "Name", "Rank"]].head(10))

st.markdown("--- ")
st.subheader("Data Dictionary")
st.markdown("""
| Column      | Data Type | Description                                                      |
|-------------|-----------|------------------------------------------------------------------|
| Label       | String    | Skincare product category                                        |
| Brand       | String    | Product brand name                                               |
| Name        | String    | Skincare product name                                            |
| Price       | Integer   | Product price                                                    |
| Rank        | Float     | Product rating                                                   |
| Ingredients | String    | List of product ingredients                                      |
| Combination | Integer   | Suitability for combination skin (1 = suitable, 0 = not suitable)|
| Dry         | Integer   | Suitability for dry skin (1 = suitable, 0 = not suitable)        |
| Normal      | Integer   | Suitability for normal skin (1 = suitable, 0 = not suitable)     |
| Oily        | Integer   | Suitability for oily skin (1 = suitable, 0 = not suitable)       |
| Sensitive   | Integer   | Suitability for sensitive skin (1 = suitable, 0 = not suitable)  |
""")