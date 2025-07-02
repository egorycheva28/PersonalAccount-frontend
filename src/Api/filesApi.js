import createAxiosInstance from "./axiosInstance";

const api = createAxiosInstance("api");

function getFile(id) {
    return api.get(`/Files/${id}`, { responseType: 'blob' })
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            console.log(error.response.data.error)
        });
}

function getTextFile(id, nameFile) {
    return api.get(`/Files/${id}`, { responseType: 'blob' })
        .then(response => {
            if (response.status === 200) {
                // Создаём URL для Blob-объекта
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/plain' }));
                // Создаём скрытую ссылку
                const a = document.createElement('a');
                a.href = url;
                a.download = `${nameFile}.txt`; // название файла
                document.body.appendChild(a);
                a.click();
                // Удаляем ссылку и освобождаем ресурсы
                a.remove();
                window.URL.revokeObjectURL(url);
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            console.log(error.response.data.error)
        });
}

function addFile(file) {
    return api.post("/Files", file)
        .then(response => {
            if (response.status === 200) {
                console.log(response);
                return response.data;
            }
        })
        .catch(error => {
            console.log(error.response.data.error)
        });
}

export const filesApi = {
    getFile: getFile,
    getTextFile: getTextFile,
    addFile: addFile
}