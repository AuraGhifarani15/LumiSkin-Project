import os

train_dir = "datasets/acne_dataset/acne_final/train"

for cls in os.listdir(train_dir):
    path = os.path.join(train_dir, cls)
    print(cls, len(os.listdir(path)))