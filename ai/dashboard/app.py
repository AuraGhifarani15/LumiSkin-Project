import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt

# ======================
# CONFIG
# ======================

st.set_page_config(
    layout="wide",
    page_title="LumiSkin Dashboard"
)

# ======================
# LOAD DATA
# ======================

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

# ======================
# SIDEBAR
# ======================

st.sidebar.title("✨ LumiSkin")

menu = st.sidebar.radio(
    "Pilih Halaman",
    [
        "Home",
        "Cosmetics",
        "Indonesia",
        "Acne Dataset",
        "Evaluation"
    ]
)

# ======================
# HOME
# ======================

if menu == "Home":

    st.title("✨ LumiSkin Dashboard")

    st.write("""
Dashboard hasil analisis Data Science
untuk sistem rekomendasi skincare.
""")

    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.metric(
            "Produk Global",
            len(cosmetics)
        )

    with c2:
        st.metric(
            "Brand Indonesia",
            indo["Brand"].nunique()
        )

    with c3:
        st.metric(
            "Rata-rata Rating",
            round(
                indo["Rating"].mean(),
                2
            )
        )

    with c4:
        st.metric(
            "Kategori Produk",
            cosmetics["Label"].nunique()
        )

# ======================
# COSMETICS
# ======================

elif menu == "Cosmetics":

    st.title("🌍 Cosmetics Dataset")

    st.subheader(
        "Distribusi Kategori Produk"
    )

    fig, ax = plt.subplots()

    cosmetics[
        "Label"
    ].value_counts().plot(
        kind="bar",
        ax=ax
    )

    st.pyplot(fig)

    st.subheader(
        "Distribusi Harga"
    )

    fig, ax = plt.subplots()

    ax.hist(
        cosmetics[
            "Price"
        ],
        bins=30
    )

    st.pyplot(fig)

    st.subheader(
        "Top Brand"
    )

    st.dataframe(

        cosmetics[
            "Brand"
        ].value_counts()

        .head(10)
    )

# ======================
# INDONESIA
# ======================

elif menu == "Indonesia":

    st.title("🇮🇩 Indonesian Skincare")

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

    st.subheader(
        "Top Recommendation"
    )

    if "recommendation_score" in indo.columns:

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

# ======================
# ACNE
# ======================

elif menu == "Acne Dataset":

    st.title(
        "🧴 Acne Dataset"
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

    st.pyplot(fig)

    st.success(
        """
Dataset telah melalui:
        - filtering
        - cleaning
        - standardisasi
        """
    )

# ======================
# EVALUATION
# ======================

elif menu == "Evaluation":

    st.title(
        "📊 Dataset Evaluation"
    )

    eval = pd.DataFrame({

        "Pemeriksaan":[

            "Missing Value",
            "Duplicate",
            "Outlier",
            "Feature Engineering",
            "Processed Dataset"

        ],

        "Status":[

            "✅",
            "✅",
            "Reviewed",
            "✅",
            "Ready"

        ]
    })

    st.table(
        eval
    )

    st.success(
"""
Dataset siap digunakan
untuk dashboard
dan AI engineer.
"""
)