import tensorflow as tf
import numpy as np

IMG_SIZE = (224, 224)

class_names = [
    "Cyst",
    "Papules",
    "Pustules"
]

model = tf.keras.models.load_model(
    "lumiskin_model.keras"
)

img = tf.keras.utils.load_img(
    "sample/test.jpg",
    target_size=IMG_SIZE
)

img_array = tf.keras.utils.img_to_array(img)

img_array = np.expand_dims(
    img_array,
    axis=0
)

prediction = model.predict(img_array)

predicted_class = class_names[
    np.argmax(prediction)
]

confidence = np.max(prediction)

print("\nHASIL PREDIKSI")
print("Class :", predicted_class)
print("Confidence :", confidence)