// SaveSystem: 서버 JSON 파일 기반 저장/불러오기

export class SaveSystem {
    // 모든 등록된 아기 + activeId
    static async getAllData() {
        const res = await fetch('/api/babies');
        return await res.json();
    }

    // 아기 등록
    static async registerBaby(data) {
        const res = await fetch('/api/babies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: data.name, babyType: data.babyType }),
        });
        return await res.json();
    }

    // 아기 삭제
    static async deleteBaby(id) {
        await fetch('/api/babies/' + id, { method: 'DELETE' });
    }

    // 활성 아기 설정
    static async setActiveBaby(id) {
        await fetch('/api/active/' + id, { method: 'PUT' });
    }

    // 활성 아기 가져오기
    static async getActiveBaby() {
        const res = await fetch('/api/active');
        return await res.json();
    }

    // 스테이지 진행 저장
    static async updateMaxStage(stageNumber) {
        await fetch('/api/stage/' + stageNumber, { method: 'PUT' });
    }

    // 영구 스탯 저장 (성장 레벨, 킬수, 드롭 스탯)
    static async saveStats(stats) {
        await fetch('/api/stats', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(stats),
        });
    }
}
