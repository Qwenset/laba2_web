class BlogController {
    constructor(model, view, authModel) {
        this.model = model;
        this.view = view;
        this.authModel = authModel;

        this.onPostsChanged(this.model.posts);
        this.view.bindAddPost(this.handleAddPost);
        this.view.bindDeletePost(this.handleDeletePost);
        this.view.bindAddComment(this.handleAddComment);
    }

    onPostsChanged = (posts) => {
        this.view.displayPosts(posts);
    };

    // Оновлений метод додавання посту (зберігає аватарку автора)
    handleAddPost = (title, text) => {
        const user = this.authModel.currentUser;
        const authorName = user ? user.name : "Гість";
        const authorAvatar = user ? user.avatar : 'logo.jpg';
        
        // Передаємо ім'я та аватарку в модель
        this.model.addPost(title, text, authorName, authorAvatar); 
        this.onPostsChanged(this.model.posts);
    };

    handleDeletePost = (id) => {
        this.model.deletePost(id);
        this.onPostsChanged(this.model.posts);
    };

    // Оновлений метод додавання коментаря (зберігає аватарку автора коментаря)
    handleAddComment = (id, text) => {
        const user = this.authModel.currentUser;
        const authorName = user ? user.name : "Гість";
        const authorAvatar = user ? user.avatar : 'logo.jpg';

        this.model.addComment(id, text, authorName, authorAvatar);
        this.onPostsChanged(this.model.posts);
    };
}

class AuthController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindLogin(this.handleLogin);
        this.view.bindRegister(this.handleRegister);
    }

    handleLogin = (email, password) => {
        if (this.model.login(email, password)) {
            this.view.showAlert("Успішний вхід!");
            window.location.href = 'profile.html';
        } else {
            this.view.showAlert("Невірний email або пароль!");
        }
    };

    // Оновлений метод реєстрації (приймає аватарку)
    handleRegister = (name, email, password, gender, dob, avatarBase64) => {
        if (this.model.register(name, email, password, gender, dob, avatarBase64)) {
            this.view.showAlert("Успішна реєстрація!");
            window.location.href = 'profile.html';
        } else {
            this.view.showAlert("Користувач з таким email вже існує!");
        }
    };
}

class ProfileController {
    constructor(authModel, view) {
        this.authModel = authModel;
        this.view = view;
        this.view.displayProfile(this.authModel.currentUser);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authModel = new AuthModel();
    
    // 1. ОНОВЛЮЄМО АВАТАРКУ В ХЕДЕРІ НА ВСІХ СТОРІНКАХ, ЯКЩО КОРИСТУВАЧ УВІЙШОВ
    if (typeof updateNavbarAvatar === 'function') {
        updateNavbarAvatar(authModel.currentUser);
    }
    
    // Ініціалізація контролерів залежно від сторінки
    if (document.getElementById('posts-container')) {
        new BlogController(new BlogModel(), new BlogView(), authModel);
    }
    
    if (document.getElementById('login-form')) {
        new AuthController(authModel, new AuthView());
    }

    if (document.getElementById('user-name')) {
        new ProfileController(authModel, new ProfileView());
    }
});