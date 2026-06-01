import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# =========================
# PAGE CONFIG
# =========================

st.set_page_config(
    page_title="LumiSkin Dashboard",
    layout="wide"
)

# =========================
# SIDEBAR
# =========================

st.sidebar.title("✨ LumiSkin Dashboard")
st.sidebar.write("Data Science Analysis")
st.sidebar.markdown("---")
st.sidebar.write("Dataset: Skincare Products")

# =========================
# LOAD DATA
# =========================

@st.cache_data
def load_data():
    return pd.read_csv("datasets/skincare_dataset/cosmetics.csv")

df = load_data()

# =========================
# TITLE
# =========================

st.title("✨ LumiSkin Dashboard")
st.write("Interactive Dashboard for Skincare Product Analysis")

# =========================
# KPI CARDS
# =========================

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("Total Products", len(df))

with col2:
    st.metric("Total Brands", df["Brand"].nunique())

with col3:
    st.metric("Average Price", round(df["Price"].mean(), 2))

with col4:
    st.metric("Average Rating", round(df["Rank"].mean(), 2))

st.markdown("---")

# =========================
# 1. PRODUCT CATEGORY
# =========================

st.subheader("1. Distribution of Skincare Product Categories")

label_counts = df["Label"].value_counts()

fig1, ax1 = plt.subplots(figsize=(10, 5))
label_counts.plot(kind="bar", ax=ax1)

ax1.set_title("Distribution of Skincare Product Categories")
ax1.set_xlabel("Product Category")
ax1.set_ylabel("Number of Products")

st.pyplot(fig1)

st.info(
    "Moisturizer is the most dominant product category with 298 products, while Sun Protect has the least with 170 products."
)

# =========================
# 2. SKIN TYPE
# =========================

st.subheader("2. Distribution of Products by Skin Type")

skin_counts = {
    "Combination": df["Combination"].sum(),
    "Dry": df["Dry"].sum(),
    "Normal": df["Normal"].sum(),
    "Oily": df["Oily"].sum(),
    "Sensitive": df["Sensitive"].sum()
}

fig2, ax2 = plt.subplots(figsize=(10, 5))

ax2.bar(
    skin_counts.keys(),
    skin_counts.values()
)

ax2.set_title("Number of Products by Skin Type")
ax2.set_xlabel("Skin Type")
ax2.set_ylabel("Number of Products")

st.pyplot(fig2)

st.info(
    "Products for Combination skin are the most numerous (966 products), while products for Sensitive skin are the least (756 products)."
)

# =========================
# 3. PRICE ANALYSIS
# =========================

st.subheader("3. Product Price Characteristics")

col1, col2, col3 = st.columns(3)

with col1:
    st.metric("Average Price", round(df["Price"].mean(), 2))

with col2:
    st.metric("Minimum Price", df["Price"].min())

with col3:
    st.metric("Maximum Price", df["Price"].max())

st.info(
    "The average price of skincare products in the dataset is 55.58, with prices ranging from 3 to 370."
)

# =========================
# 4. PRICE BY CATEGORY
# =========================

st.subheader("4. Average Price per Product Category")

avg_price_per_category = (
    df.groupby("Label")["Price"]
    .mean()
    .sort_values(ascending=False)
)

fig3, ax3 = plt.subplots(figsize=(10, 5))

avg_price_per_category.plot(
    kind="bar",
    ax=ax3
)

ax3.set_title("Average Price by Product Category")
ax3.set_xlabel("Category")
ax3.set_ylabel("Average Price")

st.pyplot(fig3)

st.info(
    "Treatment has the highest average price, while Cleanser has the lowest."
)

# =========================
# 5. RATING DISTRIBUTION
# =========================

st.subheader("5. Distribution of Product Ratings")

fig4, ax4 = plt.subplots(figsize=(10, 5))

ax4.hist(df["Rank"], bins=20)

ax4.set_title("Distribution of Product Ratings")
ax4.set_xlabel("Rating")
ax4.set_ylabel("Number of Products")

st.pyplot(fig4)

st.info(
    "The average product rating is 4.15 out of 5, indicating that most products receive positive reviews."
)

# =========================
# UNRATED PRODUCTS
# =========================

st.subheader("Products with Rating 0")

st.dataframe(
    df[df["Rank"] == 0][["Brand", "Name", "Rank"]].head(10)
)

# =========================
# DATA DICTIONARY
# =========================

st.markdown("---")

st.subheader("Data Dictionary")

dictionary_df = pd.DataFrame({
    "Column": [
        "Label", "Brand", "Name", "Price", "Rank",
        "Ingredients", "Combination", "Dry",
        "Normal", "Oily", "Sensitive"
    ],
    "Description": [
        "Skincare product category",
        "Product brand name",
        "Product name",
        "Product price",
        "Product rating",
        "List of ingredients",
        "Suitable for combination skin",
        "Suitable for dry skin",
        "Suitable for normal skin",
        "Suitable for oily skin",
        "Suitable for sensitive skin"
    ]
})

st.dataframe(dictionary_df)

# =========================
# CONCLUSION
# =========================

st.markdown("---")

st.subheader("Conclusion")

st.success("""
1. Moisturizer is the most dominant skincare category.
2. Combination skin products dominate the dataset.
3. Treatment products have the highest average price.
4. Most products have high ratings.
5. The dataset is suitable for supporting skincare recommendation systems.
""")