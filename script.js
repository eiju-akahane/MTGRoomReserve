// 画像選択の処理
function selectRoom(roomId, imgElement) {
    // 全ての画像から選択状態を解除
    document.querySelectorAll('.room-image').forEach(img => {
        img.classList.remove('selected');
    });

    // 選択された画像に選択状態を追加
    imgElement.classList.add('selected');

    // フォームの会議室選択を更新
    document.getElementById('room').value = roomId;
}

// フォーム送信の処理
function handleSubmit(event) {
    event.preventDefault();

    // フォームデータの取得
    const room = document.getElementById('room').value;
    const startDateTime = document.getElementById('startDateTime').value;
    const endDateTime = document.getElementById('endDateTime').value;
    const reserverName = document.getElementById('reserverName').value;

    // バリデーション
    if (!validateDateTime(startDateTime, endDateTime)) {
        alert('予約時間が無効です。開始時間は終了時間より前である必要があります。');
        return;
    }

    // CSVデータの作成
    const csvData = createCsvData(room, startDateTime, endDateTime, reserverName);

    // CSVファイルのダウンロード
    downloadCsv(csvData);

    // フォームのリセット
    event.target.reset();
    document.querySelectorAll('.room-image').forEach(img => {
        img.classList.remove('selected');
    });
}

// 日時のバリデーション
function validateDateTime(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate < endDate;
}

// CSVデータの作成
function createCsvData(room, start, end, reserver) {
    const header = "会議室,開始日時,終了日時,予約者\n";
    const row = `${room},${start},${end},${reserver}\n`;
    return header + row;
}

// CSVファイルのダウンロード
function downloadCsv(csvData) {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    a.href = url;
    a.download = `reservation_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();

    // クリーンアップ
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}