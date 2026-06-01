import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# ====================================
# CONFIG
# ====================================

st.set_page_config(
    page_title="LumiSkin Dashboard",
    layout="wide"
)

# ====================================
# LOAD DATA
# ====================================

@st.cache_data
def load_data():

    cosmetics = pd.read_csv(
        "datasets/processed/processed_cosmetics.csv"
    )

    indo = pd.read_csv(
        "datasets/processed/processed_indonesian_skincare.csv"
    )

    return cosmetics, indo


cosmetics, indo = load_data()

# ====================================
# SIDEBAR
# ====================================

st.sidebar.title("✨ LumiSkin")

menu = st.sidebar.radio(
    "Pilih Halaman",
    [
        "🏠 Home",
        "🌍 Cosmetics",
        "🇮🇩 Indonesia",
        "🧴 Acne Dataset",
        "📊 Evaluation"
    ]
)

# ====================================
# HOME
# ====================================

if menu == "🏠 Home":

    st.title("✨ LumiSkin Dashboard")

    st.caption(
        """
Dashboard hasil analisis Data Science
untuk sistem rekomendasi skincare.
"""
    )

    c1, c2, c3, c4 = st.columns(4)

    c1.metric(
        "Produk Global",
        len(cosmetics)
    )

    c2.metric(
        "Brand Indonesia",
        indo["Brand"].nunique()
    )

    c3.metric(
        "Rata-rata Rating",
        round(
            indo["Rating"].mean(),
            2
        )
    )

    c4.metric(
        "Kategori Produk",
        cosmetics["Label"].nunique()
    )

    st.markdown("---")

    st.info(
"""
Dashboard ini mengintegrasikan hasil EDA,
preprocessing, evaluasi dataset,
dan analisis image dataset.
"""
    )

# ====================================
# COSMETICS
# ====================================

elif menu == "🌍 Cosmetics":

    st.title("🌍 Global Cosmetics Analysis")

    col1, col2 = st.columns(2)

    with col1:

        st.subheader(
            "Distribusi Kategori"
        )

        fig, ax = plt.subplots()

        cosmetics[
            "Label"
        ].value_counts().plot(
            kind="bar",
            ax=ax
        )

        st.pyplot(fig)

        st.info(
"""
Kategori produk menunjukkan
distribusi yang tidak merata.
"""
        )

    with col2:

        st.subheader(
            "Distribusi Harga"
        )

        fig, ax = plt.subplots()

        ax.hist(
            cosmetics[
                "Price"
            ],
            bins=25
        )

        st.pyplot(fig)

        st.info(
"""
Dataset memiliki rentang harga
produk yang cukup beragam.
"""
        )

    st.subheader(
        "Top 10 Brand"
    )

    st.dataframe(

        cosmetics[
            "Brand"
        ]

        .value_counts()

        .head(10)
    )

# ====================================
# INDONESIA
# ====================================

elif menu == "🇮🇩 Indonesia":

    st.title(
        "🇮🇩 Indonesian Skincare Analysis"
    )

    col1, col2 = st.columns(2)

    with col1:

        st.subheader(
            "Top Product Type"
        )

        fig, ax = plt.subplots()

        indo[
            "Type"
        ].value_counts().head(
            10
        ).plot(
            kind="bar",
            ax=ax
        )

        st.pyplot(fig)

    with col2:

        st.subheader(
            "Distribusi Rating"
        )

        fig, ax = plt.subplots()

        ax.hist(
            indo[
                "Rating"
            ],
            bins=20
        )

        st.pyplot(fig)

    st.info(
"""
Mayoritas produk memperoleh
rating positif dari pengguna.
"""
    )

    if "recommendation_score" in indo.columns:

        st.subheader(
            "Top Recommendation"
        )

        st.dataframe(

            indo

            .sort_values(
                "recommendation_score",
                ascending=False
            )

            [[
                "Brand",
                "Name",
                "Rating",
                "recommendation_score"
            ]]

            .head(10)
        )

# ====================================
# ACNE
# ====================================

elif menu == "🧴 Acne Dataset":

    st.title(
        "🧴 Acne Image Dataset"
    )

    c1, c2, c3 = st.columns(3)

    c1.metric(
        "Train",
        1850
    )

    c2.metric(
        "Validation",
        632
    )

    c3.metric(
        "Test",
        596
    )

    acne = pd.DataFrame({

        "Class":[
            "Cyst",
            "Papules",
            "Pustules"
        ],

        "Train":[
            645,
            621,
            584
        ],

        "Valid":[
            206,
            209,
            217
        ],

        "Test":[
            189,
            202,
            205
        ]

    })

    st.dataframe(
        acne
    )

    fig, ax = plt.subplots()

    acne.set_index(
        "Class"
    ).plot(
        kind="bar",
        ax=ax
    )

    st.pyplot(
        fig
    )

    st.success(
"""
Dataset telah melalui:

✅ Filtering

✅ Cleaning

✅ Standardisasi

✅ Siap untuk tahap berikutnya
"""
    )

# ====================================
# EVALUATION
# ====================================

elif menu == "📊 Evaluation":

    st.title(
        "📊 Dataset Evaluation"
    )

    evaluation = pd.DataFrame({

        "Pemeriksaan":[

            "Missing Value",

            "Duplicate",

            "Outlier",

            "Feature Engineering",

            "Processed Dataset"

        ],

        "Status":[

            "Completed",

            "Completed",

            "Reviewed",

            "Completed",

            "Ready"

        ]

    })

    st.table(
        evaluation
    )

    st.success(
"""
Dataset siap digunakan
untuk dashboard dan
pengembangan tahap berikutnya.
"""
    )

# ====================================
# FOOTER
# ====================================

st.markdown("---")

st.caption(
"""
LumiSkin Dashboard • Data Science Team • 2026
"""
)