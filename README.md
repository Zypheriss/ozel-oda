# Discord.js v14 Özel oda bot

Bu bot Discord.js v14 kullanılarak geliştirilmiş bir özel oda ( private room ) botudur

## Özellikler

- `/setup` komutu ile ses kanal ve kategoriyi kurarsınız
- `/top` komutu ile en çok seste aktif duranları listelersiniz
- kendinize özel kanal oluşturma ve yönetme
- panel ile yönetimi kolaylıkla sağlama
- top list görme
- kanala üye ekleme özelliği

## Kurulum

1. `config.json` dosyasını düzenleyin:
   - `token`: Discord bot token'ınızı ekleyin
   - `clientId`: Bot kullanıcı ID'nizi ekleyin

2. Bağımlılıkları yükleyin:
   ```
   npm install
   ```

3. Slash komutları kaydedin:
   ```
   node deploy-commands.js
   ```

4. Botu başlatın:
   ```
   node index.js
   ```

## Kullanım

1. `/setup` komutunu kullanarak log kanalı ve yetkili rolünü ayarlayın
2. `/ticket` komutunu kullanarak ticket mesajının gönderileceği kanalı seçin
3. Kullanıcılar "Destek talebi oluştur!" butonuna tıklayarak ticket oluşturabilirler

# Botun Örnek görselleri

![zypheris](./zyp/ozel-oda.png) 


![zypheris](./zyp/özel-oda.png) 


![zypheris](./zyp/ozel-oda2.png) 


## 📞 İletişim & Destek
[![Discord](https://img.shields.io/badge/ZYPHERİS-DİSCORD-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/773582512647569409)
### 🌍 **Bize Ulaşın**
Botla ilgili soru ve destek için:

[![Discord](https://img.shields.io/badge/DISCORD-SUNUCUMUZ-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/sxWz2fayFa)
[![Zypheris instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/ilwixi7)


- Discord.js v14 kullanılmıştır
- croxydb veritabanı kullanılmıştır
- discord-html-transcripts paketi ile talep dökümü oluşturulmaktadır
