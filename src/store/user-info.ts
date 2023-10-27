import { defineStore } from 'pinia';


interface UserStore {
    userList: any[]
}

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            userName: "xxx",
            userId: 0
        };
    },
    actions: {
        saveUserInfo(userName: string, userId: number) {
            this.userName = userName;
            this.userId = userId;
        },
    },
});

