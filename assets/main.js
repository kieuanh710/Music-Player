const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat ');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat: false,
    config:  {},
    // JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) ||
    // (1/2) Uncomment the line below to use localStorage
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Ai muốn nghe không?",
            singer: "Đen Vâu",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg"
        },
        {
            name: "Sugar",
            singer: "Maroon 5",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.jpg"
        },
       
        {
            name: "What do you mean?",
            singer: "Justin Bieber",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.png"
        },
        {
            name: "Mang tiền về cho mẹ",
            singer: "Đen Vâu",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.jpg"
        },
        {
            name: "How long",
            singer: "Chalie Puth",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.jpg"
        },
        {
            name: "Mặt trời khóc",
            singer: "Emmce",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.jpg"
        },
        {
            name: "All too well",
            singer: "Taylor Swift",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/song7.jpg"
        },
        {
            name: "7 rings",
            singer: "Ariana Grance",
            path: "./assets/music/song8.mp3",
            image: "./assets/img/song8.jpg"
        },
        {
            name: "Kill this love",
            singer: "BlackPink",
            path: "./assets/music/song9.mp3",
            image: "./assets/img/song9.jpeg"
        },
        {
            name: "Thanh xuân",
            singer: "Dalab",
            path: "./assets/music/song10.mp3",
            image: "./assets/img/song10.jpg"
        },
        {
            name: "Du Ddu Du Ddu",
            singer: "BlackPink",
            path: "./assets/music/song11.mp3",
            image: "./assets/img/song11.png"
        },
        {
            name: "Love Shot",
            singer: "EXO",
            path: "./assets/music/song12.mp3",
            image: "./assets/img/song12.png"
        },
        {
            name: "Blank Space",
            singer: "Taylor Swift",
            path: "./assets/music/song13.mp3",
            image: "./assets/img/song13.jpg"
        },
        {
            name: "Vùng ký ức",
            singer: "Chillies",
            path: "./assets/music/song14.mp3",
            image: "./assets/img/song14.jpg"
        },
        {
            name: "Vì sao",
            singer: "Chillies",
            path: "./assets/music/song15.mp3",
            image: "./assets/img/song15.jpg"
        },
    ],

    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    // show danh sach bai hat
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? "active" : ''}" data-index="${index}" >
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        });
        playlist.innerHTML = htmls.join('\n');
    },

    // định nghĩa thuộc tính cho object
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        });
    },

    // xử lý các sự kiện
    handleEvents: function(){
        const _this = this;
        // Phóng to thu nhỏ cd
        const cdWidth = cd.offsetWidth; 
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity - newCdWidth / cdWidth;
        }

        // Xử lý cd quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],
        {
            duration: 10000, //10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();
        
        // Play/pause
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause(); 
            } else{
                audio.play();
            }
        };

        // Khi play 
        audio.onplay = function(){
            _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
        };
        // Khi pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        // Load theo tiến độ bài hát
        audio.ontimeupdate = function(){
            const progress = $('#progress');
            if(audio.duration){
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            };
            // console.log(Math.random());
        }

        // Tua bài hát
        progress.onchange = function(e){
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
            // console.log(audio.duration / 100 * e.target.value);
        }

        // Khi next bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Khi prev bài hát
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        // Khi random bài hát
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        
        // Xử lý lặp lại
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý next bài hát khi bài hát kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            } else{
                nextBtn.click();
            }
        }

        // Lắng ngeh hành vi click vào playlist
        playlist.onclick = function(e){
            const songNote = e.target.closest('.song:not(.active)');
            const optionNote = e.target.closest('.option');
            if(songNote || optionNote) {
                
                // xử lý khi click vào song
                if(songNote){
                    _this.currentIndex = Number(songNote.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // xử lý khi clock vào option
                if(optionNote){

                }
            }
            //e.target.closest - trả về element hoặc thẻ cha không tìm thấy thì trả về null
        }

    },

    // Tải thông tin bài hát đầu tiên khi chạy ứng dụng
    loadCurrentSong: function(){

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        console.log(heading, cdThumb, audio);
    },

    //  Gán cấu hình từ config vào ứng dụng
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    // Next bài hát
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    // Lùi bài hát
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    // Random bài hát
    randomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex);
        // console.log(newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // 
    scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 200);
    },

    start: function(){
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        // this.randomSong();
        this.render();
        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();