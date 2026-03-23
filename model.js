class BlogModel {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('devblog_posts')) || [];
    }

    commit(posts) {
        this.posts = posts;
        localStorage.setItem('devblog_posts', JSON.stringify(posts));
    }

   addPost(title, text, authorName, authorAvatar) {
        const newPost = {
            id: Date.now().toString(),
            title: title,
            text: text,
            author: authorName,
            avatar: authorAvatar,
            date: new Date().toLocaleDateString('uk-UA'),
            comments: []
        };
        this.posts.push(newPost);
        this.commit(this.posts);
    }

    deletePost(id) {
        this.posts = this.posts.filter(post => post.id !== id);
        this.commit(this.posts);
    }

    addComment(postId, commentText, authorName, authorAvatar) {
        this.posts = this.posts.map(post => {
            if (post.id === postId) {
                post.comments.push({ text: commentText, author: authorName, avatar: authorAvatar });
            }
            return post;
        });
        this.commit(this.posts);
    }
}

class AuthModel {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('devblog_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('devblog_currentUser')) || null;
    }

    
register(name, email, password, gender, dob, avatarBase64) {
    if (this.users.find(u => u.email === email)) return false;
    
    
    const finalAvatar = avatarBase64 || 'logo.jpg';
    
    const newUser = { 
        name, 
        email, 
        password, 
        gender, 
        dob, 
        avatar: finalAvatar 
    };
    
    this.users.push(newUser);
    localStorage.setItem('devblog_users', JSON.stringify(this.users));
    this.currentUser = newUser;
    localStorage.setItem('devblog_currentUser', JSON.stringify(newUser));
    return true;
}

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('devblog_currentUser', JSON.stringify(user));
            return true;
        }
        return false;
    }
}