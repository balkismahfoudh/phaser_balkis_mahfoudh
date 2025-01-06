// Phaser.js Scrollable In-Game Shop Widget

// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
        preload: preload,
        create: create,
        resize: resize,
        update: update
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
let yOffset = 0;

// Preload Assets
function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('topBanner', 'assets/shoptitle.png');
    this.load.image('closeButton', 'assets/closeButton.png');
    this.load.image('underBanner', 'assets/GAS_shop.png');
    this.load.image('item1', 'assets/item1.png');
    this.load.image('item2', 'assets/item2.png');
    this.load.image('item3', 'assets/item3.png');
    this.load.image('item4', 'assets/item4.png');
    this.load.image('item5', 'assets/item5.png');
    this.load.image('item6', 'assets/item6.png');
    this.load.image('item7', 'assets/item7.png');
    this.load.image('item8', 'assets/item8.png');
    this.load.image('item9', 'assets/item9.png');
    this.load.image('item10', 'assets/item10.png');
    this.load.image('buyButtonBg', 'assets/shopelements/Buy_Button02.png');
    this.load.image('buyButtonBgClicked', 'assets/shopelements/Buy_Button02_Clicked.png');
    this.load.image('itemsBox2', 'assets/shopelements/Itemsbox2_shop.png');
    this.load.image('itemsBox1', 'assets/shopelements/Itemsbox1_shop.png');


    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

    this.load.audio('clickSound', 'https://labs.phaser.io/assets/audio/SoundEffects/p-ping.mp3');


}

// Create Shop Scene
function create() {
    // Add background image
    const background = this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

    // Add top banner image
    this.topBanner = this.add.image(this.scale.width / 2, 50, 'topBanner')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(200, 100);
    this.topBanner.setDepth(1);

    // Add close button to the right of the top banner
    this.closeButton = this.add.image(this.scale.width - 30, 50, 'closeButton')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(50, 50)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            alert('Shop closed');
        });
    this.closeButton.setDepth(1);

    // Add image under the top banner
    this.underBanner = this.add.image(this.scale.width / 2, this.topBanner.y + 100, 'underBanner')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(this.scale.width * 0.8, 80);
    this.underBanner.setDepth(1);

    this.headerContainer = this.add.container(0, 0);
    this.headerContainer.add([this.topBanner, this.closeButton, this.underBanner]);
    this.headerContainer.setDepth(1);

    const items = [
        { name: 'Level 1', key: 'item1', price: 100 },
        { name: 'Level 2', key: 'item2', price: 250 },
        { name: 'Level 3', key: 'item3', price: 400 },
        { name: 'Level 4', key: 'item4', price: 650 },
        { name: 'Level 5', key: 'item5', price: 800 },
        { name: 'Level 6', key: 'item6', price: 1050 },
        { name: 'Level 7', key: 'item7', price: 1200 },
        { name: 'Level 8', key: 'item8', price: 1350 },
        { name: 'Level 9', key: 'item9', price: 1500 },
        { name: 'Level 10', key: 'item10', price: 1650 }
    ];

    this.scrollContainer = this.add.container(0, this.underBanner.y + this.underBanner.displayHeight / 2 + 20);

    yOffset = 0;

    items.forEach((item, index) => {
        const sound = this.sound.add('clickSound');
        const backgroundKey = (index % 2 === 0) ? 'itemsBox1' : 'itemsBox2';
        const rowBackground = this.add.image(this.scale.width / 2 , yOffset + 50, backgroundKey);
        rowBackground.setDisplaySize(this.scale.width / 2 + 130, 100); // Set width and height for the row
        const itemImage = this.add.image(rowBackground.x - rowBackground.displayWidth / 2 + rowBackground.displayWidth / 6, yOffset + 15, item.key).setScale(0.5).setOrigin(0.5, 0);
        const itemName = this.add.text(this.scale.width / 2, yOffset + 20, item.name, { fontFamily: 'chubby-choo-regular', fontSize: '24px', fill: '#fff' }).setOrigin(0.5, 0);
        const buyButtonBg = this.add.image(rowBackground.x + rowBackground.displayWidth / 2 - 60, yOffset + 10, 'buyButtonBg').setOrigin(0.5, 0).setScale(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            alert(`Item ${item.name} is purchased!`);
            buyButtonBg.setTexture('buyButtonBgClicked'); 
            sound.play();
        })
        const buyButtonText = this.add.text(buyButtonBg.x - 10, buyButtonBg.y + 15, item.price, {  fontFamily: 'chubby-choo-regular', fontSize: '18px', fill: '#fff' })
        .setOrigin(0.5, 0)
       

        this.scrollContainer.add([rowBackground, itemImage, itemName, buyButtonBg, buyButtonText]);
        yOffset += 100;
    });

    // Scroll Logic
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
        const lowerBound = this.underBanner.y + this.underBanner.displayHeight / 2 + 20;
        const upperBound = -yOffset + this.scale.height;

        if ((deltaY > 0 && this.scrollContainer.y > upperBound) || (deltaY < 0 && this.scrollContainer.y < lowerBound)) {
            this.scrollContainer.y -= deltaY * 0.5;
        }
    });
}

// Resize function to handle dynamic resizing
function resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    this.cameras.resize(width, height);
}

// Update function to control opacity and visibility based on scroll position
function update() {
    const fadeStart = this.underBanner.y + this.underBanner.displayHeight / 2;
    const fadeEnd = fadeStart + 200;
    const visibleRange = { top: fadeStart, bottom: fadeEnd };

    const topBannerY = this.underBanner.y + 10; // The Y position of the bottom of the top banner

    this.scrollContainer.iterate(child => {
        const childY = child.y + this.scrollContainer.y;

        if (childY < visibleRange.top || childY > visibleRange.bottom) {
            // Gradually fade out items outside the visible range
            const opacity = Math.max(0, 1 - Math.abs(childY - (fadeStart + fadeEnd) / 2) / 300);
            child.setAlpha(opacity);
        } else {
            // Full opacity for the 3 visible items
            child.setAlpha(1);
        }

        // Hide items when they scroll past the topBanner
        if (childY < topBannerY) {
            child.setVisible(false);
        } else {
            child.setVisible(true);
        }
    });
}

