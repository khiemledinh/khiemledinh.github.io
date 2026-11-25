# Gemini AI Voice Studio — Kế hoạch nâng cấp

## 1. Mục tiêu

Cho phép người dùng dán trực tiếp một đoạn bài nghe hoặc hội thoại thô, nhấn **Chuẩn hóa**, xem và chỉnh sửa kết quả trong textarea, sau đó tạo một file MP3 hoàn chỉnh gồm:

1. Lời dẫn của `Narrator`.
2. Hội thoại giữa các nhân vật.
3. Khoảng nghỉ tự nhiên giữa lời dẫn và hội thoại.

File cuối cùng được ghép và encode thành **một MP3 duy nhất**.

## 2. Các quyết định đã thống nhất

- Chuẩn hóa bằng code trước vì cần bảo toàn chính xác nội dung bài tập.
- Chỉ gọi AI khi code không xác định được cấu trúc hoặc speaker.
- `Narrator` là một cấu hình riêng, không tính vào số lượng speaker hội thoại.
- Speaker hội thoại được phát hiện động từ nội dung, không dùng cố định `Alex`, `Sarah`, `David`.
- Mỗi request multi-speaker tối đa hai nhân vật hội thoại.
- Narrator và hội thoại được tạo bằng các request riêng ở phía sau.
- PCM của các đoạn audio được ghép trước; MP3 chỉ được encode một lần sau cùng.
- Người dùng luôn được xem và chỉnh kịch bản sau khi chuẩn hóa.
- Bản gốc được lưu tạm để hỗ trợ nút **Hoàn tác**.

## 3. Luồng người dùng

```text
Dán văn bản thô
        ↓
Chuẩn hóa bằng code
        ↓
Nếu cấu trúc không rõ → hỏi người dùng có muốn dùng AI không
        ↓
Cập nhật kịch bản đã chuẩn hóa vào textarea
        ↓
Hiển thị cấu hình Narrator và các nhân vật được phát hiện
        ↓
Người dùng chọn voice/style và chỉnh nội dung nếu cần
        ↓
Tạo audio Narrator
        ↓
Tạo audio hội thoại
        ↓
Ghép PCM + khoảng nghỉ
        ↓
Encode MP3 một lần
        ↓
Phát, tải xuống và lưu history
```

## 4. Cấu trúc dữ liệu đề xuất

```js
{
  narrator: {
    text: '',
    voice: 'Kore',
    style: 'clear, steady, classroom exam announcer'
  },
  characters: [
    {
      name: 'Mai',
      voice: 'Puck',
      style: 'friendly, curious, natural'
    },
    {
      name: 'Mom',
      voice: 'Aoede',
      style: 'warm, relaxed, caring'
    }
  ],
  turns: [
    {
      speaker: 'Mai',
      text: 'Mom, do you remember the wildlife documentary we watched last night?',
      style: ''
    },
    {
      speaker: 'Mom',
      text: 'Of course! I loved the part about endangered animals.',
      style: ''
    }
  ]
}
```

`Narrator` không nằm trong `characters` và không được tính vào `speakerCount`.

## 5. Chuẩn hóa bằng code

### 5.1. Nhận diện lời dẫn

Phần nội dung trước speaker đầu tiên được đưa vào Narrator. Các dòng bắt đầu bằng những từ khóa sau cần được ưu tiên xem là lời dẫn:

- `Exercise`
- `Activity`
- `Track`
- `Listen`
- `Complete`
- `Instructions`

Ví dụ:

```text
Exercise 1: 🎧 (Track 7.22) Listen to the conversation...
```

Không được hiểu `Exercise 1` là tên speaker.

### 5.2. Nhận diện speaker

- Chỉ nhận dạng speaker ở dạng `Tên: Nội dung`.
- Loại trừ URL, thời gian, số thứ tự và các dòng hướng dẫn.
- Gộp các dòng tiếp theo vào lượt thoại hiện tại.
- Chuẩn hóa khoảng trắng và xuống dòng.
- Giữ nguyên ý nghĩa và nội dung chính của câu thoại.
- Không tự ý dịch hoặc viết lại nội dung bài tập.

### 5.3. Xử lý phần không cần đọc

Có thể loại bỏ hoặc chuyển đổi các thành phần trình bày:

- Emoji như `🎧`.
- Ký hiệu trang trí.
- Dấu ngoặc chứa metadata không cần đọc.

Nên giữ lại nội dung có ý nghĩa như `Track 7.22`, nhưng có thể chuyển thành dạng dễ đọc cho TTS, ví dụ `Track seven point two two`.

## 6. Chuẩn hóa bằng AI fallback

AI chỉ được sử dụng khi bộ parser không thể xác định chắc chắn:

- Speaker bị thiếu hoặc trộn lẫn.
- Có nhiều đoạn dẫn xen giữa hội thoại.
- Tên nhân vật không nhất quán.
- Văn bản không có xuống dòng rõ ràng.

Prompt AI phải yêu cầu:

- Giữ nguyên ngôn ngữ và ý nghĩa.
- Không bỏ yêu cầu bài tập.
- Không đổi tên nhân vật đã có.
- Trả về đúng format chuẩn hóa.
- Không thêm giải thích ngoài kịch bản.

Sau khi nhận kết quả AI cần validate lại speaker, số lượt thoại và nội dung rỗng trước khi cập nhật textarea.

## 7. Giao diện cấu hình voice

### 7.1. Narrator

Hiển thị một card riêng:

- Voice.
- Phong cách đọc mặc định: `clear, steady, classroom exam announcer`.
- Có thể chỉnh style.
- Có thể nghe thử voice nếu không gây tiêu hao quota không cần thiết.

### 7.2. Nhân vật

Tạo card động theo tên phát hiện trong script:

```text
Mai
  Voice: Puck
  Style: friendly, curious, natural

Mom
  Voice: Aoede
  Style: warm, relaxed, caring
```

Voice phải được lưu theo tên nhân vật, không lưu theo vị trí trong mảng. Nếu thứ tự nhân vật thay đổi, voice đã chọn không được bị đổi nhầm.

## 8. Pipeline tạo và ghép audio

```text
Narrator request
        ↓
Dialogue request (tối đa 2 speakers)
        ↓
Kiểm tra mime type
        ↓
Decode WAV hoặc raw PCM về PCM 16-bit mono
        ↓
Chuẩn hóa sample rate
        ↓
Chèn silence 500–1000 ms
        ↓
Ghép các PCM buffer
        ↓
Encode MP3 một lần
        ↓
Tạo Blob, Player URL, Download URL và History record
```

### Quy tắc audio

- Không nối trực tiếp hai file MP3.
- Không nối hai file WAV còn nguyên header.
- Hai đoạn phải cùng sample rate, channel và bit depth.
- Chỉ gọi `mp3encoder.flush()` sau khi đã ghép toàn bộ PCM.
- Nếu cần, thêm fade-out/fade-in 5–10 ms ở điểm nối để tránh click.
- Nếu API trả WAV hoàn chỉnh thì dùng đúng dữ liệu WAV hoặc decode bỏ header trước khi ghép.
- Nếu API trả raw PCM thì decode theo little-endian 16-bit.

## 9. Thay đổi dự kiến trong code hiện tại

- Tách `narratorConfig` khỏi `speakers`.
- Thay `speakerCount` cố định bằng danh sách speaker được phát hiện.
- Viết lại `formatDialogueScript()` để không coi `Exercise 1:` là speaker.
- Viết parser trả về `narrator`, `characters` và `turns`.
- Cập nhật `syncSpeakersFromNormalizedScript()` để đồng bộ theo tên.
- Tách `generateNarratorAudio()` và `generateDialogueAudio()`.
- Viết `mergePcmSegments()`.
- Sửa `createAudioOutput()` để phân biệt WAV và raw PCM.
- Encode MP3 sau khi ghép thay vì encode từng đoạn.
- Cập nhật history để chỉ lưu file MP3 cuối cùng.
- Giữ bản gốc và hỗ trợ hoàn tác sau normalize.

## 10. Tiêu chí hoàn thành

- Dán được bài nghe có phần hướng dẫn và hai nhân vật.
- Chuẩn hóa đúng thành `Narrator`, `Mai`, `Mom`.
- Kết quả chuẩn hóa được cập nhật vào textarea.
- Người dùng có thể sửa nội dung trước khi tạo audio.
- Voice của Narrator và nhân vật được cấu hình riêng.
- Không gửi Narrator vào request multi-speaker.
- Audio cuối cùng chỉ có một file MP3.
- Không có tiếng xẹt/xì ở cuối hoặc tại điểm nối.
- History, player và download dùng file MP3 cuối cùng.
- Có thể hoàn tác về nội dung gốc.
- AI fallback không làm mất hoặc tự ý thay đổi yêu cầu bài tập.

## 11. Phạm vi chưa làm ở giai đoạn đầu

- Voice cloning.
- Hơn hai nhân vật hội thoại trong cùng một request.
- Đồng bộ phụ đề theo từng từ.
- Streaming audio theo thời gian thực.
- Backend bảo vệ API key cho website public.

## 12. Tính năng hiện có cần giữ lại

Việc nâng cấp parser và pipeline audio không được làm mất các tính năng hữu ích đang có. Các tính năng sau cần được giữ lại hoặc refactor để tương thích với kiến trúc mới:

- Lưu và khôi phục cấu hình bằng `localStorage`.
- Lưu lịch sử audio bằng IndexedDB.
- Phát lại, tải xuống và xóa từng mục trong history.
- Xóa toàn bộ history.
- Audio player tùy chỉnh với thời gian hiện tại và tổng thời lượng.
- Waveform visualizer khi phát audio.
- Điều chỉnh tốc độ phát 0.75x–1.5x.
- Nút hủy generation và trạng thái tiến trình.
- Retry/backoff khi API quá tải hoặc tạm thời lỗi.
- Auto fallback model, nhưng cần giữ lại error classification chính xác.
- Chọn model tùy chỉnh và làm mới danh sách model.
- Các preset script đơn giọng và hội thoại.
- Nút xóa script.
- Nút đặt lại toàn bộ cấu hình về mặc định nhưng không xóa API key.
- Bộ đếm ký tự.
- Chuẩn hóa bằng AI và nút hoàn tác về bản gốc.
- MP3 encoding bằng `lamejs` và WAV fallback khi MP3 encoding thất bại.
- Responsive layout, dark theme, toast notification và status indicator.

### Nguyên tắc bảo toàn tính năng

- Không thay đổi hành vi của các tính năng không liên quan đến parser/audio merge.
- Giữ nguyên state key hoặc bổ sung migration để state cũ không bị mất.
- History mới vẫn dùng cùng IndexedDB nhưng lưu file MP3 cuối cùng đã ghép.
- Các voice/style cũ được giữ lại khi tên nhân vật sau normalize vẫn trùng khớp.
- Nếu không thể tương thích hoàn toàn, ưu tiên migration mềm và hiển thị thông báo thay vì xóa dữ liệu người dùng.
- Chỉ thay đổi UI khi cần bổ sung Narrator, speaker động hoặc trạng thái nhiều bước tạo audio.

## 13. Cập nhật triển khai sau khi kiểm thử

Các quyết định sau đã được áp dụng trong `tts/index.html`:

- Model mặc định sau mỗi lần reload là `gemini-3.8-flash-tts`.
- Thứ tự fallback là:
  1. `gemini-3.8-flash-lite-tts`.
  2. `gemini-3.1-flash-tts-preview`.
  3. `gemini-2.5-flash-preview-tts`.
  4. `gemini-2.5-flash-tts`.
- Lựa chọn model cũ trong `localStorage` không được tự khôi phục sau reload; model chính 3.8 được chọn lại. Giá trị custom model vẫn được giữ để người dùng chọn lại thủ công.
- `gemini-2.5-pro-preview-tts` bị loại khỏi fallback vì không có Free Tier phù hợp với API key miễn phí.
- Model generic không phải TTS, ví dụ `gemini-3.8-flash`, không được đưa vào danh sách TTS tự động. Model custom vẫn có thể nhập thủ công nếu API hỗ trợ.
- Không gửi `systemInstruction` cho request TTS. Nhiều model TTS không hỗ trợ trường này và việc retry lại cùng request là không cần thiết.
- Model 3.x sử dụng `speechMetadata` để tách style và speaker metadata khỏi transcript. Transcript được giữ riêng để tránh đọc phần mô tả giọng thành tiếng.
- Fallback Gemini 2.5 nhận style qua prompt legacy trong `contents`, gồm phần hướng dẫn voice/delivery và phần `TRANSCRIPT`. Model 2.5 có thể đọc phần hướng dẫn; đây là giới hạn đã chấp nhận để vẫn có cơ hội điều khiển tốc độ/style khi fallback, và phần đầu audio có thể được cắt bỏ nếu cần.
- Chỉ dẫn nói chậm, rõ được áp dụng cho cả request Narrator và từng lượt thoại của mọi nhân vật hội thoại, không chỉ riêng lời dẫn.
- Preset giao diện 3 người đã được bỏ để tránh tạo request sai; multi-speaker vẫn chặn rõ ràng khi phát hiện hơn hai nhân vật.
- Sau khi fallback, player, download và IndexedDB history vẫn chỉ nhận một file audio cuối cùng đã ghép.

### Kiểm thử sau cập nhật

- Kiểm tra cú pháp tất cả inline JavaScript trong `tts/index.html`.
- Kiểm tra payload 3.x dùng metadata có cấu trúc và payload 2.5 chứa style legacy nhưng không còn `systemInstruction`.
- Kiểm tra thứ tự fallback và việc reload luôn chọn `gemini-3.8-flash-tts`.
- Kiểm tra `git diff --check`.

