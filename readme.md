## 🛡️ Authentication (Kimlik Doğrulama)

### `POST /api/auth/register`
Yeni kullanıcı kaydı oluşturur.

**Request Body:**
```json
{
  "name": "Ali Veli",
  "email": "ali@example.com",
  "password": "123456"
}
```

### `POST /api/auth/login`
Kullanıcı girişini yapar. Başarılı girişte JWT token döner.

**Request Body:**
```json
{
  "email": "ali@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "Ali Veli"
  }
}
```

---

## 📚 Lessons (Dersler)

### `GET /api/lessons`
Tüm dersleri listeler.

### `GET /api/lessons/{id}`
ID’si verilen dersi getirir.

### `POST /api/lessons`
Yeni bir ders oluşturur.

**Request Body:**
```json
{
  "title": "Fizik 1",
  "code": "FZK101"
}
```

---

## 📝 Exams (Sınavlar)

### `GET /api/exams`
Tüm sınavları getirir.

### `GET /api/lessons/{lesson_id}/exams`
Belirli derse ait sınavları listeler.

### `GET /api/exams/{id}`
Sınav detayını getirir.

### `POST /api/exams`
Yeni sınav ekler.

**Request Body:**
```json
{
  "lesson_id": 1,
  "title": "Fizik 1 Vize",
  "description": "Çıkmış sorular testi"
}
```

---

## ❓ Questions + Answers (Sorular ve Cevaplar)

### `GET /api/exams/{exam_id}/questions`
Belirli sınavın tüm sorularını ve cevaplarını getirir.

- Soruların sıralaması rastgele.
- Her sorunun cevapları (şıklar) da rastgele sıralanmıştır.
- `is_correct` flag'i sadece front-end'de kontrol amaçlı kullanılır.

**Response:**
```json
[
  {
    "id": 101,
    "text": "Yer çekimi ivmesi nedir?",
    "answers": [
      { "id": 1, "text": "9.8 m/s²", "is_correct": true },
      { "id": 2, "text": "10 m/s²", "is_correct": false },
      { "id": 3, "text": "5 m/s²", "is_correct": false },
      { "id": 4, "text": "12 m/s²", "is_correct": false }
    ]
  }
]
```

⚠️ Bu endpoint sınav başında çağrılır. Kullanıcı sınavı çözerken backend ile bağlantı gerekmez. Doğru/yanlış kontrolleri frontend'de yapılır.

---

## ✅ Submit (Test Gönderme)

### `POST /api/quizzes/submit`
Kullanıcı sınavı çözdükten sonra doğru, yanlış ve boş sayısını backend'e iletir.

**Request Body:**
```json
{
  "user_id": 1,
  "exam_id": 10,
  "correct": 7,
  "incorrect": 2,
  "empty": 1
}
```

**Response:**
```json
{
  "message": "Quiz submitted successfully.",
  "result_id": 55
}
```

---

## 📊 Quiz History (Kullanıcı Sonuçları)

### `GET /api/quizzes/{user_id}`
Kullanıcının tüm sınav geçmişini getirir.