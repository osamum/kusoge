(function () {
    var thisGame = {

        /*--- 定数の定義 ---*/
        //ゲーム領域のサイズ
        GAME_WIDTH: 640, //768,
        GAME_HEIGHT: 640, //768,
        //ゲームの FPS
        GAME_FPS: 25, //35,

        //点数を表示するラベルのフォント
        SCORE_LABEL_FONT: "12px Goudy Stout",
        //同ラベルの文字の色
        SCORE_LABEL_COLOR: "blue",
        //同ラベルの位置
        SCORE_LABEL_POSITION_X: 10,
        SCORE_LABEL_POSITION_Y: 5,

        //プレイヤーの残数ラベルのフォント
        RESIDUE_LABEL_FONT: "12px Goudy Stout",
        //同ラベルの文字の色
        RESIDUE_LABEL_COLOR: "blue",

        ASSET_PIC_START: "img/start.png",
        ASSET_PIC_GAMEOVER: "img/gameover.png",

        ASSET_PIC_PLAYER: "img/chara1.png",
        PLAYER_WIDTH: 32,
        PLAYER_HEIGHT: 32,
        PLAYER_INIT_X: 80, //100,
        PLAYER_INIT_Y: 120,

        ASSET_PIC_BACK_GROUND1: "img/bk-ground.jpg",

        ASSET_PIC_GROUND1: "img/ground1.png",
        ASSET_PIC_GROUND2: "img/ground2.png",
        ASSET_PIC_GROUND3: "img/ground3.png",

        ASSET_PIC_TRAP1: "img/box.png",
        ASSET_PIC_TRAP2: "img/bomb.png",
        ASSET_PIC_TRAP3: "img/bird.jpg",



        //地平線の高さ
        GROUND_LINE: 350,

    
        /*--- オブジェクトのインスタンスを格納する変数 ---*/
        //ゲーム全体 (enchant.js が提供する game オブジェクト)
        game: null,
       
        //プレイヤーのインスタンス
        ctrl_player: null,

        ctrl_trap1: null,
        ctrl_trap2: null,
        ctrl_trap3: null,

        //スコアを表示するラベル
        ctrl_scoreLabel: null,

        //プレイヤーの残数を表示するラベル
        ctrl_playerResidueLabel: null,

        //現在のステージを表示するラベル
        ctrl_stageLabel: null,

        //ゲーム表示領域 (HTML の div タグ)
        ctrl_gameStage: null,

        player_residue_count: 3,

      
        //コントロールのインスタンスを生成
        setCtrls: function () {

            //ゲームのインスタンスを生成
            var game = thisGame.ctrlUtilitys.createGame(thisGame.GAME_FPS, thisGame.GAME_WIDTH, thisGame.GAME_HEIGHT);

            // スコアを表示するラベルを生成
            var createLabel = this.ctrlUtilitys.createLabel;
            this.ctrl_scoreLabel = createLabel("SCORE : 0",
                this.SCORE_LABEL_FONT, this.SCORE_LABEL_COLOR, this.SCORE_LABEL_POSITION_X, this.SCORE_LABEL_POSITION_Y);

            //プレイヤーの残数を表示するラベルを生成
            this.ctrl_residueLabel = createLabel("PLAYER: 3",
                this.RESIDUE_LABEL_FONT, this.RESIDUE_LABEL_COLOR, this.GAME_WIDTH - 150, this.SCORE_LABEL_POSITION_Y);

            //ステージを表示するラベルを生成
            this.ctrl_stageLabel = createLabel("STAGE : 01",
                this.RESIDUE_LABEL_FONT, this.RESIDUE_LABEL_COLOR, (this.GAME_WIDTH / 2) - 90, this.SCORE_LABEL_POSITION_Y);

            thisGame.game = game;

            
            return this;
        },
       
        //ゲームの初期化
        initializeGame: function (eventEndler) {
            var game = thisGame.game;
            //ゲームの準備ができたら
            game.onload = function () {
                //プレイヤーのインスタンスを生成
                thisGame.ctrl_player = thisGame.ctrlUtilitys.createPlayer(game);

                //一番最初のステージ
                thisGame.utilitys.routingStage(0);

            }
            return this;
        },
        handlers: function () {

        },

        //コントロール (UI) 関連の処理
        ctrlUtilitys: {
            //ゲームのインスタンスを生成する
            createGame: function (fps, width, height) {
                var game = new Game(width, height);

                //フレームレートを指定
                game.fps = fps;
                //画像のプリロード
                game.preload(thisGame.ASSET_PIC_PLAYER,
                    thisGame.ASSET_PIC_START, thisGame.ASSET_PIC_GAMEOVER,
                    thisGame.ASSET_PIC_BACK_GROUND1,
                    thisGame.ASSET_PIC_TRAP1, thisGame.ASSET_PIC_TRAP2, thisGame.ASSET_PIC_TRAP3,
                    thisGame.ASSET_PIC_GROUND1, thisGame.ASSET_PIC_GROUND2, thisGame.ASSET_PIC_GROUND3);
                game.score = 0;
                return game;
            },
            //プレイヤーのインスタンスを生成
            createPlayer: function (game) {
                var player = new Sprite(thisGame.PLAYER_WIDTH, thisGame.PLAYER_HEIGHT);
                player.image = game.assets[thisGame.ASSET_PIC_PLAYER];
                player.x = thisGame.PLAYER_INIT_X;
                player.y = thisGame.GROUND_LINE - player.height;
                return player;
            },
            //障害物を生成
            createTrap: function (game,assetName, width, height) {
                var trap = new Sprite(width, height);
                trap.image = game.assets[assetName];
                trap.x = -width;                  // 横位置調整 画面外に隠しておく
                trap.y = thisGame.GROUND_LINE - trap.height;
                return trap;
            },
            //地面を生成
            createGround: function (game, assetName, width, height, posX,  height_Gap) {
                var ground = new Sprite(width, height);
                ground.image = game.assets[assetName];
                ground.x = posX;                  // 横位置調整 画面外に隠しておく
                ground.y = thisGame.GROUND_LINE + height_Gap;
                return ground;
            },
            //:点数/ステージなどのラベルを生成
            createLabel: function (labelText, fontName, fontColor, posX, posY) {
                var infoLabel = new Label(labelText);
                infoLabel.font = fontName;
                infoLabel.color = fontColor;
                infoLabel.x = posX;
                infoLabel.y = posY;
                return infoLabel;
            },
            //プレイヤーをジャンプさせる
            playerJump: function (player) {
                player.tl.moveBy(0, -120, 12, enchant.Easing.CUBIC_EASEOUT)　//12フレームかけて現在の位置から上に120px移動
                          .moveBy(0, 120, 12, enchant.Easing.CUBIC_EASEIN); //12フレームかけて現在の位置から下に120px移動
            },
            //背景画像の設定
            insertBackGroundImg: function (stage, game, backGroundName) {
                var gameWidth = thisGame.GAME_WIDTH;
                var gameHeight = thisGame.GAME_HEIGHT;
                var currentScene = game.currentScene;
                var bkgImg = new Sprite(gameWidth, gameHeight);
                bkgImg.image = thisGame.game.assets[backGroundName];
                bkgImg.x = 0;
                bkgImg.y = 0;
                currentScene.addChild(bkgImg);

                stage.ctrl_backGround1 = bkgImg;

                var bkgImg2 = new Sprite(gameWidth, gameHeight);
                bkgImg2.image = thisGame.game.assets[backGroundName];
                bkgImg2.x = 640;
                bkgImg2.y = 0;
                currentScene.addChild(bkgImg2);

                stage.ctrl_backGround2 = bkgImg2;
            },
            fowordBgPicJob: function (player, bkground1, bkground2, scrollSpeed, gameWidth) {
                if (player.frame != 3) {
                    player.frame++;
                    if (player.frame > 2) { player.frame = 0 };
                }
                bkground1.x -= scrollSpeed;                // 背景1をスクロール
                bkground2.x -= scrollSpeed;                // 背景2をスクロール

                if (bkground1.x <= -gameWidth) {                  // 背景1が画面外に出たら
                    bkground1.x = gameWidth;                      // 画面右端に移動
                }
                if (bkground2.x <= -gameWidth) {                  // 背景2が画面外に出たら
                    bkground2.x = gameWidth;                      // 画面右端に移動
                }

            },
            rewindBgPicJob: function (player, bkground1, bkground2, scrollSpeed, gameWidth) {
                if (player.frame != 3) {
                    player.frame++;
                    if (player.frame > 2) { player.frame = 0 };
                }
                bkground1.x += scrollSpeed;                // 背景1をスクロール
                bkground2.x += scrollSpeed;                // 背景2をスクロール
                if (bkground1.x >= gameWidth) {                  // 背景1が画面外に出たら
                    bkground1.x = -gameWidth;                      // 画面右端に移動
                }
                if (bkground2.x >= gameWidth) {                  // 背景2が画面外に出たら
                    bkground2.x = -gameWidth;                     // 画面右端に移動
                }
            }
        },
        //関数群
        utilitys: {
            //ステージの振り分け
            routingStage: function (stageCount) {
                var player = thisGame.ctrl_player;
                var game = thisGame.game;
                //旧いシーン(ステージ)を削除
                game.popScene();
                //新しいシーンを生成
                var currentScene = new Scene();
                game.pushScene(currentScene);
                switch (stageCount) {
                    case 0:
                        //初回ステージへ
                        var stage01 = thisGame.stages.stage01;
                        thisGame.ctrlUtilitys.insertBackGroundImg(stage01, game, thisGame.ASSET_PIC_BACK_GROUND1);
                        stage01.setCtrl(game).loadCtrls(currentScene).setHandlers(game);
                        break;
                }
                
            },
            //プレイヤーにぶつかったかどうか判断
            isPlayerHit: function (player, target2) {
                if (player.within(target2, 10)) {
                    player.frame = 3;
                    thisGame.player_residue_count--;
                    thisGame.ctrl_residueLabel.text = "Player:" + thisGame.player_residue_count;
                    if (thisGame.player_residue_count === 0) {
                        thisGame.game.pushScene(thisGame.utilitys.createGameoverScene(10));
                    }
                }
            },
            getCenterPosition: function (contenoreWidth, targetWidth) {
                return (contenoreWidth / 2) - (targetWidth / 2);
            },
            createGameoverScene: function (scroll) {
                var game = thisGame.game;
                var scene = new Scene();                                   // 新しいシーンを作る
                scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';              // シーンの背景色を設定
                // ゲームオーバー画像を設定
                var gameoverImage = new Sprite(189, 97);                   // スプライトを作る
                gameoverImage.image = game.assets[thisGame.ASSET_PIC_GAMEOVER];  // 画像を設定
                gameoverImage.x = thisGame.utilitys.getCenterPosition(thisGame.GAME_WIDTH,189);                                      // 横位置調整
                gameoverImage.y = thisGame.utilitys.getCenterPosition(thisGame.GAME_HEIGHT, 97); // 縦位置調整
                scene.addChild(gameoverImage); // シーンに追加
                
                return scene;
            }
        },
        stages: {}
    };







    //ステージ 1 の処理
    thisGame.stages.stage01 =  {
        //背景をスクロールさせるスピード
        BACKGROUND_SCROLL_SPEED: 10,
        //現在のシーン
        currentScene: null,
        //障害物のインスタンス
        ctrl_trap1: null,
        ctrl_trap2: null,
        ctrl_trap3: null,

        ctrl_ground1: null,
        ctrl_ground2: null,
        ctrl_ground3: null,

        //背景画像
        ctrl_backGround1: null,
        ctrl_backGround2: null,
        //スクロールのカウント
        scrollCount: 0,

        _privGround: null,

        //ステージ 1 で使用するコントロールをセット
        setCtrl: function (game) {
            var createTrap = thisGame.ctrlUtilitys.createTrap;
            var createGround = thisGame.ctrlUtilitys.createGround;
            //障害物のインスタンスを生成
            this.ctrl_trap1 = createTrap(game, thisGame.ASSET_PIC_TRAP2, 48, 48);
            this.ctrl_trap2 = createTrap(game, thisGame.ASSET_PIC_TRAP1, 48, 48);
            this.ctrl_trap3 = createTrap(game, thisGame.ASSET_PIC_TRAP3, 85, 60);

            this.ctrl_ground1 = createGround(game, thisGame.ASSET_PIC_GROUND2, 200, 35, 0, 0);
            this.ctrl_trap1.y = this.ctrl_ground1.y - this.ctrl_trap1.height;
            this.ctrl_ground2 = createGround(game, thisGame.ASSET_PIC_GROUND2, 200, 35, 250, 40);
            this.ctrl_trap2.y = this.ctrl_ground2.y - this.ctrl_trap2.height;
            this.ctrl_ground3 = createGround(game, thisGame.ASSET_PIC_GROUND2, 200, 35, 500, -40);
            this.ctrl_trap3.y = this.ctrl_ground3.y - this.ctrl_trap3.height;

            return this;
        },
        //ステージ 1 でのイベントハンドラを設定
        setHandlers: function (game) {
            var player = thisGame.ctrl_player;
            var thisStage = thisGame.stages.stage01;
            var scrollBackGround = thisGame.ctrlUtilitys.scrollBackGround;
            var playerJump = thisGame.ctrlUtilitys.playerJump;
            var currentScene = game.currentScene;
            thisStage._privGround = thisStage.ctrl_ground1;
            //フレームごとのイベント処理
            currentScene.addEventListener(Event.ENTER_FRAME, function () {
                thisStage.handlers.enterFrame(game, thisStage, player, thisGame.ctrlUtilitys, playerJump);
            }, false);

            //ゲーム画面がタッチされた際の処理
            currentScene.addEventListener(Event.TOUCH_START, function (e) {
                //プレイヤーをジャンプさせる
                playerJump(player);
            }, false);
            return;
        },
        //コントロールをロード
        loadCtrls: function (currentScene) {
            currentScene.addChild(thisGame.ctrl_scoreLabel);
            currentScene.addChild(thisGame.ctrl_residueLabel);
            currentScene.addChild(thisGame.ctrl_stageLabel);
            currentScene.addChild(thisGame.ctrl_player);
            currentScene.addChild(this.ctrl_trap1);
            currentScene.addChild(this.ctrl_trap2);
            currentScene.addChild(this.ctrl_trap3);
            currentScene.addChild(this.ctrl_ground1);
            currentScene.addChild(this.ctrl_ground2);
            currentScene.addChild(this.ctrl_ground3);
            return this;
        },
        handlers: {
            //フレームごとの処理
                enterFrame: function (game, stage, player, utility, playerJump) {

                    //上ボタンが押されたらジャンプ
                    if (game.input.up) {
                        playerJump(player);
                        game.input.up = false;
                    }
                    stage.stageUtility.scrollJob(game, stage, player, utility);
                    thisGame.utilitys.isPlayerHit(player, stage.ctrl_trap1);
                    thisGame.utilitys.isPlayerHit(player, stage.ctrl_trap2)
                    thisGame.utilitys.isPlayerHit(player, stage.ctrl_trap3)

                   
                        if (player.intersect(stage.ctrl_ground1)) {
                            player.y = stage.ctrl_ground1.y - player.height;
                            stage._privGround = stage.ctrl_ground1;
                        } else if (player.intersect(stage.ctrl_ground2)) {
                            player.y = stage.ctrl_ground2.y - player.height;
                            stage._privGround = stage.ctrl_ground2;
                        } else if (player.intersect(stage.ctrl_ground3)) {
                            player.y = stage.ctrl_ground3.y - player.height;
                            stage._privGround = stage.ctrl_ground3;
                        } else {
                            if (stage._privGround == null) {
                                player.y += stage.BACKGROUND_SCROLL_SPEED;
                                return;
                            };
                            if ((player.x > stage._privGround.x) && (player.x < stage._privGround.x + stage._privGround.width))
                            {} else {
                                player.y += stage.BACKGROUND_SCROLL_SPEED;
                                stage._privGround = null;
                            }
                        }
                    
                }
        },

        //ステージ独自の処理
        stageUtility: {

                //背景その他のスクロール処理
                scrollJob: function (game, stage, player, utility) {
                    var bkground1 = stage.ctrl_backGround1;
                    var bkground2 = stage.ctrl_backGround2;
                    var gameWidth = thisGame.GAME_WIDTH;
                    var scrollSpeed = stage.BACKGROUND_SCROLL_SPEED;
                    var scrollCount = stage.scrollCount;

                    if (game.input.right) {
                        game.input.left = false;
                        //背景を左方向にスクロール (左キー:前進)
                        utility.fowordBgPicJob(player, bkground1, bkground2, scrollSpeed, gameWidth);
                        stage.stageUtility.fowardTrap(stage);
                    } else if (game.input.left) {
                        game.input.right = false;
                        //左方向にもどる処理
                        utility.rewindBgPicJob(player, bkground1, bkground2, scrollSpeed, gameWidth);
                        stage.stageUtility.rewindTrap(stage);
                    }
                },
                fowardTrap: function (stage) {
                    var trap1 = stage.ctrl_trap1;
                    var trap2 = stage.ctrl_trap2;
                    var trap3 = stage.ctrl_trap3;

                    var ground1 = stage.ctrl_ground1;
                    var ground2 = stage.ctrl_ground2;
                    var ground3 = stage.ctrl_ground3;

                    var scrollSpeed = stage.BACKGROUND_SCROLL_SPEED;
                    var scrollCount = stage.scrollCount;
                    var gameWidth = thisGame.GAME_WIDTH;

                    scrollCount += scrollSpeed;

                    thisGame.ctrl_scoreLabel.text = scrollCount;

                    //fowordItem(trap1, 200);
                    //fowordItem(trap2, 400);
                    fowordItem(trap3, 200, 1.2, true);

                   
                    fowordGround(ground1, 10, trap1);
                    fowordGround(ground2, 10, trap2);
                    fowordGround(ground3, 10);
                    
                    
                    //背景に合わせてアイテムをスクロールさせる共通関数
                    function fowordItem(item, x_gap, acceleration,effectFlg) {
                        if ( (scrollCount % x_gap === 0) && (item.x <= -(item.width-10))) {item.x = gameWidth;}
                        if (item.x > -item.width) { 
                            item.x -= (acceleration) ? scrollSpeed * acceleration : scrollSpeed;
                        }
                        if (effectFlg) { item.frame = (item.frame > 0) ? 0 : 1; }
                    }
                    function fowordGround(item, x_gap, trap) {
                            item.x -=scrollSpeed;
                            if (trap!=null) trap.x -=scrollSpeed;
                        if (item.x <= -(item.width - x_gap)) {
                            item.x = gameWidth;
                            if (trap != null)  trap.x = (gameWidth + 50);
                        }
                    }
                    stage.scrollCount = scrollCount;
                },
                rewindTrap: function (stage) {
                    var trap1 = stage.ctrl_trap1;
                    var trap2 = stage.ctrl_trap2;
                    var trap3 = stage.ctrl_trap3;
                    var scrollSpeed = stage.BACKGROUND_SCROLL_SPEED;
                    var scrollCount = stage.scrollCount;
                    var gameWidth = thisGame.GAME_WIDTH;
                    scrollCount -= scrollSpeed;


                    /*
                    if (scrollCount % 1280 === 0) {              // 1280m走るごとに
                        trap1.x = -50;                    // ハードルを右端に移動(出現)
                    }
                    */
                    if (trap1.x > -trap1.width) { // ハードルが出現している(画面内にある)とき
                        trap1.x += scrollSpeed;   // ハードルをスクロール
                    }

                    /*
                    if (scrollCount % 1600 === 0) {              // 1600m走るごとに
                        trap2.x = -56;                    // ハードルを右端に移動(出現)
                    }
                    */

                    if (trap2.x > -trap2.width) { // ハードルが出現している(画面内にある)とき
                        trap2.x += scrollSpeed;   // ハードルをスクロール
                    }
                    stage.scrollCount = scrollCount;
                }
        }
    }





    enchant();
    window.onload = function () {
        thisGame.setCtrls().initializeGame().game.start();
    }
})();

