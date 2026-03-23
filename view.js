class BlogView {
    constructor() {
        this.app = document.getElementById('posts-container');
        this.postForm = document.getElementById('add-post-form');
        this.titleInput = document.getElementById('post-title');
        this.textInput = document.getElementById('post-text');
    }

    displayPosts(posts) {
        if (!this.app) return;
        while (this.app.firstChild) {
            this.app.removeChild(this.app.firstChild);
        }

        if (posts.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'Немає публікацій. Створіть перший пост!';
            p.className = 'text-muted';
            this.app.append(p);
        } else {
            posts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'card mb-4 shadow-sm border-0';
                card.id = post.id;

                let commentsHTML = '';
                post.comments.forEach(comment => {
                    commentsHTML += `
                        <div class="bg-light p-2 rounded mb-2 d-flex align-items-center">
                            <img src="${comment.avatar || 'logo.jpg'}" alt="Avatar" class="rounded-circle mr-2" style="width: 30px; height: 30px; object-fit: cover;">
                            <p class="mb-0 small"><strong>${comment.author}:</strong> ${comment.text}</p>
                        </div>`;
                });

                card.innerHTML = `
                    <div class="card-body">
                        <h3 class="card-title h5">${post.title}</h3>
                        <div class="d-flex align-items-center mb-2">
                            <img src="${post.avatar || 'logo.jpg'}" alt="Author Avatar" class="rounded-circle mr-2" style="width: 40px; height: 40px; object-fit: cover; border: 2px solid #007bff;">
                            <p class="text-muted small mb-0">Автор: <strong class="text-primary">${post.author || 'Гість'}</strong> | Опубліковано: ${post.date}</p>
                        </div>
                        <p class="card-text">${post.text}</p>
                        <button class="btn btn-sm btn-outline-danger delete-post-btn">Видалити пост</button>
                        <hr>
                        <h6>Коментарі:</h6>
                        <div class="comments-list">${commentsHTML}</div>
                        <form class="form-inline mt-2 comment-form">
                            <input type="text" class="form-control form-control-sm mr-2 w-75 comment-input" placeholder="Ваш коментар..." required>
                            <button type="submit" class="btn btn-sm btn-secondary">Ок</button>
                        </form>
                    </div>
                `;
                this.app.append(card);
            });
        }
    }

    bindAddPost(handler) {
        if (this.postForm) {
            this.postForm.addEventListener('submit', event => {
                event.preventDefault();
                if (this.titleInput.value && this.textInput.value) {
                    handler(this.titleInput.value, this.textInput.value);
                    this.titleInput.value = '';
                    this.textInput.value = '';
                }
            });
        }
    }

    bindDeletePost(handler) {
        if (this.app) {
            this.app.addEventListener('click', event => {
                if (event.target.classList.contains('delete-post-btn')) {
                    const id = event.target.closest('.card').id;
                    handler(id);
                }
            });
        }
    }

    bindAddComment(handler) {
        if (this.app) {
            this.app.addEventListener('submit', event => {
                if (event.target.classList.contains('comment-form')) {
                    event.preventDefault();
                    const id = event.target.closest('.card').id;
                    const commentInput = event.target.querySelector('.comment-input');
                    if (commentInput.value) {
                        handler(id, commentInput.value);
                        commentInput.value = '';
                    }
                }
            });
        }
    }
}

class AuthView {
    constructor() {
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');
        this.avatarInput = document.getElementById('reg-avatar');
    }

    bindLogin(handler) {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', event => {
                event.preventDefault();
                const email = document.getElementById('login-email').value.trim().toLowerCase();
                const password = document.getElementById('login-password').value.trim();
                handler(email, password);
            });
        }
    }

    // Оновлений метод зчитування файлу
    bindRegister(handler) {
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', event => {
                event.preventDefault();
                const name = document.getElementById('reg-name').value.trim();
                const email = document.getElementById('reg-email').value.trim().toLowerCase();
                const password = document.getElementById('reg-password').value.trim();
                const gender = document.getElementById('reg-gender').value;
                const dob = document.getElementById('reg-dob').value;
                
                const file = this.avatarInput.files[0];
                
                if (file) {
                    // Якщо файл вибрано, зчитуємо його
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        // reader.result містить Base64 рядок
                        handler(name, email, password, gender, dob, reader.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    // Якщо файл не вибрано, передаємо null
                    handler(name, email, password, gender, dob, null);
                }
            });
        }
    }

    showAlert(message) {
        alert(message);
    }
}

class ProfileView {
    constructor() {
        this.nameField = document.getElementById('user-name');
        this.emailField = document.getElementById('user-email');
        this.genderField = document.getElementById('user-gender');
        this.dobField = document.getElementById('user-dob');
        this.avatarImg = document.getElementById('profile-avatar');
    }

    displayProfile(user) {
        if (!user) return;
        if (this.nameField) this.nameField.textContent = user.name;
        if (this.emailField) this.emailField.textContent = user.email;
        if (this.genderField) this.genderField.textContent = user.gender;
        if (this.dobField) this.dobField.textContent = user.dob;
        // Оновлюємо велику аватарку на сторінці профілю
        if (this.avatarImg) this.avatarImg.src = user.avatar || 'logo.jpg';
    }
}

// ГЛОБАЛЬНА ФУНКЦІЯ ДЛЯ ОНОВЛЕННЯ ХЕДЕРА НА ВСІХ СТОРІНКАХ
function updateNavbarAvatar(user) {
    const navAvatar = document.querySelector('.navbar-logo');
    if (navAvatar && user && user.avatar) {
        navAvatar.src = user.avatar;
        // Робимо її круглою і красивою
        navAvatar.style.width = '40px';
        navAvatar.style.height = '40px';
        navAvatar.style.objectFit = 'cover';
        navAvatar.style.borderRadius = '50%';
        navAvatar.style.border = '2px solid #fff';
    }
}