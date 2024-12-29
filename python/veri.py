import requests
import pandas as pd

# Türkiye'ye ait ürünleri OpenFoodFacts API'sinden çekme
def fetch_turkey_products():
    url = "https://world.openfoodfacts.org/cgi/search.pl"
    page = 1
    all_products = []

    while True:
        params = {
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "tagtype_0": "countries",
            "tag_contains_0": "contains",
            "tag_0": "turkey",
            "page": page,  # Sayfa numarası
            "page_size": 100,  # Aynı anda çekilecek ürün sayısı
        }
        response = requests.get(url, params=params)
        
        # API yanıtını kontrol et
        if response.status_code == 200:
            products = response.json().get("products", [])
            if not products:
                break  # Ürün yoksa döngüyü sonlandır
            all_products.extend(products)  # Ürünleri birleştir
            page += 1  # Sonraki sayfaya geç
        else:
            print("API isteği başarısız oldu:", response.status_code)
            break

    return all_products

# Ürün bilgilerini işleme ve temizleme
def process_products(products):
    data = []
    for product in products:
        product_name = product.get("product_name", "Bilinmeyen Ürün")
        image_url = product.get("image_url", "Resim Yok")
        categories = product.get("categories", "Kategori Yok")
        
        # Ürün ismini Türkçe olarak kontrol et
        if product_name and isinstance(product_name, str) and all(ord(c) < 128 for c in product_name):
            data.append({
                "Ürün Adı": product_name,
                "Resim URL": image_url,
                "Kategoriler": categories
            })
    return data

# CSV dosyasına kaydetme
def save_to_csv(data, filename="turkey_products.csv"):
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False, encoding="utf-8-sig")
    print(f"Veriler {filename} dosyasına kaydedildi.")

# Ana fonksiyon
def main():
    print("Türkiye'ye ait tüm ürünler çekiliyor...")
    products = fetch_turkey_products()
    if not products:
        print("Ürün bulunamadı!")
        return
    print(f"{len(products)} ürün bulundu.")
    data = process_products(products)
    save_to_csv(data)

if __name__ == "__main__":
    main()
