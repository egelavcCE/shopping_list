import pandas as pd
import os
import json

# CSV'den JSON'a dönüştürme ve kaydetme
def csv_to_json(csv_file, json_file):
    try:
        # CSV dosyasını oku
        df = pd.read_csv(csv_file)
        
        # DataFrame'i JSON formatına çevir
        json_data = df.to_dict(orient="records")
        
        # JSON dosyasını belirttiğin klasöre kaydet
        os.makedirs(os.path.dirname(json_file), exist_ok=True)  # Klasör yoksa oluştur
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(json_data, f, ensure_ascii=False, indent=4)
        
        print(f"Veriler {json_file} dosyasına JSON formatında kaydedildi.")
    except FileNotFoundError:
        print(f"Hata: {csv_file} dosyası bulunamadı. Lütfen dosya yolunu kontrol edin.")
    except Exception as e:
        print(f"Beklenmeyen bir hata oluştu: {e}")

# Ana fonksiyon
def main():
    csv_file = "turkey_products.csv"  # Daha önce oluşturduğun CSV dosyası
    json_file = "client/src/data/data.json"  # JSON dosyasının kaydedileceği yer
    csv_to_json(csv_file, json_file)

if __name__ == "__main__":
    main()
