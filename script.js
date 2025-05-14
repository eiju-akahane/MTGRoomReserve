// 画像選択の処理
function select_room(roomId, imgElement) {
    // 全ての画像から選択状態を解除
    document.querySelectorAll('.room-image').forEach(img => {
        img.classList.remove('selected');
    });

    // 選択された画像に選択状態を追加
    imgElement.classList.add('selected');

    // フォームの会議室選択を更新
    document.getElementById('room').value = roomId;
}

// 時刻選択肢の生成
function generate_time_options() {
    const startTime = document.getElementById('startTime');
    const endTime = document.getElementById('endTime');
    const times = [];

    // 30分間隔で時刻を生成（9:00～21:00）
    for (let hour = 9; hour <= 21; hour++) {
        for (let minute of ['00', '30']) {
            const time = `${hour.toString().padStart(2, '0')}:${minute}`;
            times.push(time);
        }
    }

    // 最後の時刻を21:00までにする
    if (times[times.length - 1] !== '21:00') {
        times.pop();
    }

    // 選択肢を追加
    [startTime, endTime].forEach(select => {
        select.innerHTML = '<option value="">選択してください</option>';
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            select.appendChild(option);
        });
    });
}

// 日付の最小値を設定
function set_min_dates() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const min_date = `${yyyy}-${mm}-${dd}`;

    document.getElementById('startDate').min = min_date;
    document.getElementById('endDate').min = min_date;
}

// フォーム送信の処理
function handle_submit(event) {
    event.preventDefault();

    // フォームデータの取得
    const room = document.getElementById('room').value;
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;
    const reserverName = document.getElementById('reserverName').value;

    // 日時の結合
    const startDateTime = `${startDate} ${startTime}:00`;
    const endDateTime = `${endDate} ${endTime}:00`;

    // バリデーション
    if (!validate_date_time(startDateTime, endDateTime)) {
        alert('予約時間が無効です。開始時間は終了時間より前である必要があります。');
        return;
    }

    // CSVデータの作成
    const csvData = create_csv_data(room, startDateTime, endDateTime, reserverName);

    // CSVファイルのダウンロード
    download_csv(csvData);

    // フォームのリセット
    event.target.reset();
    document.querySelectorAll('.room-image').forEach(img => {
        img.classList.remove('selected');
    });
}

// 日時のバリデーション
function validate_date_time(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate < endDate;
}

// CSVデータの作成
function create_csv_data(room, start, end, reserver) {
    const header = "会議室,開始日時,終了日時,予約者\n";
    const row = `${room},${start},${end},${reserver}\n`;
    return header + row;
}

// CSVファイルのダウンロード
function download_csv(csvData) {
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

// 日付変更時の処理
function handle_date_change() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // 開始日が選択されたら、終了日の最小値を開始日に設定
    if (startDate) {
        document.getElementById('endDate').min = startDate;
    }

    // 終了日が開始日より前の場合、終了日を開始日に設定
    if (endDate && startDate && endDate < startDate) {
        document.getElementById('endDate').value = startDate;
    }
}

// ページ読み込み時の初期化
window.addEventListener('load', () => {
    generate_time_options();
    set_min_dates();

    // 日付変更イベントのリスナーを設定
    document.getElementById('startDate').addEventListener('change', handle_date_change);
    document.getElementById('endDate').addEventListener('change', handle_date_change);
});