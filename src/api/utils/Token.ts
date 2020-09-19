let TOKEN: any = {};
export const Token = {
    async getToken(username?: string, password?: string){
        TOKEN = TOKEN.jwt || JSON.parse(localStorage.getItem("token")) || {};
        // Check if token is valid
        if(TOKEN.jwt){
            try{
                const response = await fetch("/pizi-rest/check", {
                    method: 'POST',
                    headers: {
                        Authorization: this.getHeader()
                    }
                });
                TOKEN = await response.json();
                localStorage.setItem("token", JSON.stringify(TOKEN));
            } catch(e){
                this.clearToken();
                console.log("Token not valid ... destroyed!");
            }
        }
        if(!TOKEN.jwt && username && password){
            const response = await fetch("/pizi-rest/token", {
                method: 'POST',
                headers: {
                    login: username,
                    password: password,
                }
            });

            TOKEN = await response.json();
            localStorage.setItem("token", JSON.stringify(TOKEN));
        }
        return TOKEN;
    },
    clearToken(){
        TOKEN = {};
        localStorage.removeItem("token");
    },
    getHeader(){
        return "Bearer " + TOKEN.jwt
    }
}