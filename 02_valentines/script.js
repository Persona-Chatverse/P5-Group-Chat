// from Raffy Banks https://jsfiddle.net/raffybanks/706dc94p/
// Returns characters typed per minute in milliseconds
function chpmToMilliseconds(chpm) {
  return (Math.random() * (1000 / (chpm / 60)));
}

// Returns words typed per minute in milliseconds
function wpmToMilliseconds(string, wpm) {
  return ((string.split(' ').length / (wpm / 60)) * 1000);
}

const userWPM = [
  //USER INDEX
  ['Akechi',  'Ann',  'Caroline', 'Chihaya', 'Futaba',  'Haru', 'Iwai', 'Justine',  'Kawakami', 'Lavensa', 'Makoto', 'Ryuji',  'Sumire',  'Tae',  'Yoshida',  'Yoskue']
  //WPM
  [1       ,   2]
];


const ChatMessage = {
  template: '#chat-message',
  props: {
    message: {
      type: String,
      required: true
    },

    remote: {
      // Does the message originate
      // from a remote source?
      type: Boolean,
      default: false
    },

    chatter: {
      // Used to lookup image
      type: String
    },

    newChatter: {
      // Does the message originate
      // from a remote source?
      type: Boolean,
      default: true
    },

    nextResponse: {
      type: Number
    },

    fontSize: {
      type: Number,
      default: 14 },

    lineHeight: {
      type: Number,
      default: 1.5 // em
    } },

  data() {
    return {
      hackText: '',
      style: {
        opacity: 0 } };

    
  },
  computed: {
    // ------------------------------------------
    //         Message Box (remote: true)
    // ------------------------------------------
    //
    //   origin                            x - right width
    //       \ [ ---- center width ---- ]  |
    //         x----------------------- x --- x
    //       / |     <message text>     |   /
    //     /   |                        | /
    //   x --- x ---------------------- x
    //      |
    //      + - left width
    //
    messageBox() {
      return {
        origin: {
          x: this.remote ? 130 : 60,
          y: 20 },

        centerWidth: 310,
        leftWidth: 10,
        rightWidth: 20,
        slantHeight: 5,
        border: {
          normal: 4,
          left: 15,
          right: 35 } };


    },
    textOffset() {
      return {
        // Left padding.
        x: 10,
        // Adjust for top/bottom padding.
        y: this.messageBox.origin.y + this.fontSize * this.lineHeight / 4 };

    },
    containerPoints() {
      return [
      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth + this.messageBox.rightWidth,
        y: this.messageBox.origin.y },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth,
        y: this.messageBox.origin.y + this.containerHeight + this.messageBox.slantHeight },

      {
        x: this.messageBox.origin.x - this.messageBox.leftWidth,
        y: this.messageBox.origin.y + this.containerHeight }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerBorderPoints() {
      return [
      {
        x: this.messageBox.origin.x - this.messageBox.border.normal,
        y: this.messageBox.origin.y - this.messageBox.border.normal },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth + this.messageBox.border.right,
        y: this.messageBox.origin.y - this.messageBox.border.normal },

      {
        x: this.messageBox.origin.x + this.messageBox.centerWidth + this.messageBox.border.normal,
        y: this.messageBox.origin.y + this.containerHeight + this.messageBox.border.normal + this.messageBox.slantHeight },

      {
        x: this.messageBox.origin.x - this.messageBox.border.left,
        y: this.messageBox.origin.y + this.containerHeight + this.messageBox.border.normal }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerTailPoints() {
      return [
      {
        x: this.messageBox.origin.x - 33,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 8 },

      {
        x: this.messageBox.origin.x - 17,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 10 },

      {
        x: this.messageBox.origin.x - 12,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 4 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 10 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 5 },

      {
        x: this.messageBox.origin.x - 18,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 10 },

      {
        x: this.messageBox.origin.x - 22,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 5 }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerTailBorderPoints() {
      return [
      {
        x: this.messageBox.origin.x - 40,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 12 },

      {
        x: this.messageBox.origin.x - 15,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 16 },

      {
        x: this.messageBox.origin.x - 12,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 10 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 - 15 },

      {
        x: this.messageBox.origin.x,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 10 },

      {
        x: this.messageBox.origin.x - 20,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 15 },

      {
        x: this.messageBox.origin.x - 24,
        y: this.messageBox.origin.y + this.containerHeight / 2 + 10 }].

      map(p => `${p.x},${p.y}`).join(' ');
    },
    containerHeight() {
      // Compute how much vertical space the message text takes up by
      // multiplying the line height by the number of lines in the message.
      let height = this.fontSize * this.lineHeight * this.wrappedMessage.length;
      // Now, we need to add some extra bottom padding otherwise the
      // descenders (the part of the characters beneath the baseline)
      // will get clipped. I don't know the exact height of the descender,
      // but I figure that 1/2 em should be fine. And then we'll add another
      // 1/4 em for top and bottom paddings (1/2 em in total).
      //
      //   ---
      //    |   top padding (1/4 em)
      //   ---
      //    |   text height (line height * # of lines)
      //   ---
      //    |   descender padding (1/2 em)
      //   ---
      // .  |   slanted bottom edge (this.messageBox.slantHeight)
      //   ---
      //    |   bottom padding (1/4 em)
      //   ---
      //
      return height + this.fontSize * this.lineHeight;
    },
    viewBoxHeight() {
      //
      //   ---
      //    |   border width
      //   ---
      //    |   container height
      //   ---
      //    |   border width
      //   ---
      //
      return this.containerHeight + this.messageBox.origin.y * 2;
    },
    primaryColor() {
      return this.remote ? 'white' : 'black';
    },
    secondaryColor() {
      return this.remote ? 'black' : 'white';
    } },

  asyncComputed: {
    wrappedMessage: {
      async get() {
        // Kind of a hacky way of implementing word wrapping
        // on SVG <text> elements. Not quite sure how to go
        // about determining the bounding box of some text,
        // without actually rendering it on the DOM.
        const words = this.message.split(/\s+/);
        const lines = [];
        let line = [];
        while (words.length > 0) {
          line.push(words.shift());
          this.hackText = line.join(' ');
          if ((await this.hackTextWidth()) > this.messageBox.centerWidth) {
            words.unshift(line.pop());
            lines.push({ text: line.join(' ') });
            line = [];
          }
        }
        lines.push({ text: line.join(' ') });
        if (lines.length === 1) {
          // Messages that are only one line have a fluid width.
          this.messageBox.centerWidth = (await this.hackTextWidth()) + this.textOffset.x * 2;
        }
        return lines;
      },
      default: [] } },


  methods: {
    async hackTextWidth() {
      // Wait until #hackText is rendered in the DOM.
      while (!this.$refs.hackText) {
        await Vue.nextTick();
      }
      // Wait for Vue to update the innerHTML of #hackText.
      await Vue.nextTick();
      if (this.$refs.hackText.innerHTML === this.hackText) {
        return this.$refs.hackText.clientWidth;
      } else {
        console.log(
        `[error] hackText does not have expected text\n` +
        `        expected: "${this.hackText}"\n` +
        `        actual:   "${this.$refs.hackText.innerHTML}"`);

        return 0;
      }
    } },

  mounted() {
    TweenMax.to(this.style, 1, {
      opacity: 1,
      ease: Power3.easeOut });

  } };


const ChatThread = new Vue({
  el: '#chat',
  template: '#chat-thread',
  components: { ChatMessage },
  data() {
    return {
      messages: [],
      queue: [
      {
        text: "Valentine's Day is coming up... do any of you have any plans?",
        chatter: 'Haru',
        remote: true
      },

      {
        text: 'I wonder...',
        chatter: 'Ryuji',
        remote: true 
      },

      {
        text: "If Ann finally kills you I'll make sure to let her off the hook.",
        chatter: 'Makoto',
        remote: true },

      {
        text: "That ain't funny.",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "Technically true... it is instead hilarious.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "I wouldn't kill Ryuji.",
        chatter: 'Ann',
        remote: true },

      {
        text: "Not even if he broke into your house at 02:00 instead of calling you like a normal person?",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Ren?",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Uh... old habits die hard? I said sorry, can you stop bringing that stuff up in the group chat?",
        chatter: 'Ren',
        remote: false },

      {
        text: "Die Hard With Hifu-gence. Gottem!",
        chatter: 'Futaba',
        remote: true },

      {
        text: "Okay... maybe I would kill Ryuji in that case.",
        chatter: 'Ann',
        remote: true },

      {
        text: "The fuck did I do?",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "Ann has told me plenty.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Still. I... may have ordered cake.",
        chatter: 'Ann',
        remote: true },

      {
        text: "So that's a no... I ain't getting shit.",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "You should be used to that by now.",
        chatter: 'Ren',
        remote: false },

      {
        text: "Fuck off.",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "No.",
        chatter: 'Ren',
        remote: false },

      {
        text: "You're gonna be alone again Ryuji...",
        chatter: 'Futaba',
        remote: true },

      {
        text: "Hey, don't bully him. It's not his fault he's passive.",
        chatter: 'Ann',
        remote: true },

      {
        text: "Yeah that's a bit dark.",
        chatter: 'Haru',
        remote: true },

      {
        text: "im goin 2 go vist my belovd doorboi",
        chatter: 'Lavensa',
        remote: true },

      {
        text: "What...",
        chatter: 'Ann',
        remote: true },

      {
        text: "Since when was there a small child here?",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Wait... we never removed Lavensa-chan, did we?",
        chatter: 'Haru',
        remote: true },

      {
        text: "Nope.",
        chatter: 'Ren',
        remote: false },

      {
        text: "Sorry, my sister took my phone away for a moment :(",
        chatter: 'Lavensa',
        remote: true },

      {
        text: "I can relate, Lavensa-chan.",
        chatter: 'Makoto',
        remote: true },

      {
        text: "The cougar or the airhead who's obsessed with that dead kid?",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "RYUJI!",
        chatter: 'Ann',
        remote: true },

      {
        text: "Elizabeth... now Margaret is scolding her.",
        chatter: 'Lavensa',
        remote: true },

      {
        text: "Does it happen often?",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Ren.",
        chatter: 'Hifumi',
        remote: true
      },

      {
        text: "I swear to Mary Mother of God, if you're some pervert I'll flay you alive.",
        chatter: 'Hifumi',
        newChatter: false,
        remote: true
      },

      {
        text: "No... why would you even think that?",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "Do you mean filet?",
        chatter: 'Yuskue',
        remote: true 
      },

      {
        text: "FFS Yuskue.",
        chatter: 'Makoto',
        remote: true 
      },

      {
        text: "He's high again... and where is he?",
        chatter: 'Haru',
        remote: true 
      },

      {
        text: "I was just making sure, that's all.",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "All the signs are in French.",
        chatter: 'Yuskue',
        remote: true },

      {
        text: "Are you still doing that gallery tour in Canada?",
        chatter: 'Ren',
        remote: false },

      {
        text: "I must be in France.",
        chatter: 'Yuskue',
        remote: true 
      },

      {
        text: "Sounds like you're in Quebec.",
        chatter: 'Makoto',
        remote: true 
      },

      {
        text: "Oh! Some of my favourite games were developed there.",
        chatter: 'Futaba',
        remote: true 
      },

      {
        text: "Unfortunately it does, Makoto... Elizabeth has deficient impulse control and a short attention span. Igor only has one attendant when the Velvet Room is in use, but since it isn't the four of us are just loitering.",
        chatter: 'Lavensa',
        remote: true 
      },

      {
        text: "Velvet Room? Igor? What is this?",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "Phantom Thieves things, Hifumi.",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "My apologies I do not believe I have met you before, Miss Togo. I am Lavensa, I was Ren's attendant during his time in the Velvet Room. Who are you?",
        chatter: 'Lavensa',
        remote: true 
      },

      {
        text: "Technically she was two of my attendants.",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "That doesn't make sense.",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "My soul was split in twain.",
        chatter: 'Lavensa',
        remote: true 
      },

      {
        text: "Hold on there... your soul?",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "It's a long story.",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "Miss Togo, if it isn't too much of an intrusion, may I ask how you came to know Ren and the others?",
        chatter: 'Lavensa',
        remote: true 
      },

      {
        text: "Well, Yuskue went to my school... and Ren kept hitting on me in Church.",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "That's terrible!",
        chatter: 'Haru',
        remote: true 
      },

      {
        text: "Don't listen to her, she's lying.",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "Oh really? I admit I may be slightly exaggerating, but it was still hallowed ground we sullied with the flames of passion.",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "Hifumi, please think of Lavensa as a naive child who's still impressionable.",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "Fine, fine. I'm just his future wife.",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "Just say girlfriend like a normal person.",
        chatter: 'Ann',
        remote: true 
      },

      {
        text: "You'll confuse Lavensa.",
        chatter: 'Makoto',
        remote: true 
      },

      {
        text: "Future widow it is then.",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "No!",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "So you intend to marry this woman? Intriguing, I do not believe a Wildcard has ever gotten married before.",
        chatter: 'Lavensa',
        remote: true 
      },

      {
        text: "She's saying Ren's ultra-rare loot.",
        chatter: 'Futaba',
        remote: true 
      },

      {
        text: "DON'T GAMIFY MY RELATIONSHIP!",
        chatter: 'Ren',
        remote: false 
      },

      {
        text: "That happened long ago, darling.",
        chatter: 'Hifumi',
        remote: true 
      },

      {
        text: "Yeah, you knew what you were signing up for.",
        chatter: 'Makoto',
        remote: true 
      },

      {
        text: "How many other wildcards are there Lavensa-chan?",
        chatter: 'Haru',
        remote: true 
      },

      {
        text: "Two that my siblings know of.",
        chatter: 'Lavensa',
        remote: true
      },

      {
        text: "So Ren ain't the only one.",
        chatter: 'Ryuji',
        remote: true
      },

      {
        text: "There was Makoto... the dead one. Elizabeth talks about him every day - that's why Theodore likes to wander off outside the Velvet Room. I would too if Margaret let me outside... oh I should ask her about the second one. That boy was her ward.",
        chatter: 'Lavensa',
        remote: true
      },

      {
        text: "Rest in peace Ms. Niijima.",
        chatter: 'Hifumi',
        remote: true
      },

      {
        text: "Sae will not rest until my killer is found. She's going to hunt down this 'Natural Causes' guy if it's the last thing she does.",
        chatter: 'Makoto',
        remote: true
      },

      {
        text: "Shut up.",
        chatter: 'Ren',
        remote: false
      },

      {
        text: "Okay, I have returned. Here's what Margaret just told me:",
        chatter: 'Lavensa',
        remote: true
      },

      {
        text: "Yu Narukami is a two-faced manwhore. Ninety percent of Rise Kujikawa's songs since she redebuted have been about how much of an asshole that little shit was.",
        chatter: 'Lavensa',
        newChatter: false,
        remote: true
      },

      {
        text: "Rise? As in Risette the idol?",
        chatter: 'Ann',
        newChatter: true,
        remote: true
      },

      {
        text: "Yes, apparently he met a student teacher named Kotone Shiomi in his final year of High School and they got married. Oddly enough their child shares the name 'Nanako' with Yu's cousin.",
        chatter: 'Lavensa',
        newChatter: true,
        remote: true
      },

      {
        text: "...",
        chatter: 'Makoto',
        newChatter: true,
        remote: true
      },

      {
        text: "What the fuck?",
        chatter: 'Ryuji',
        newChatter: true,
        remote: true
      },

      {
        text: "Disgusting.",
        chatter: 'Ann',
        newChatter: true,
        remote: true
      },

      {
        text: "I cannot unread that.",
        chatter: 'Ren',
        newChatter: true,
        remote: false
      },

      {
        text: "Back on topic, Ren and I were just going to hang out in my pool. Ann, Ryuji, why don't you guys swing over and we can make it a double date?",
        chatter: 'Hifumi',
        newChatter: true,
        remote: true
      },

      {
        text: "Sounds great!",
        chatter: 'Ann',
        newChatter: true,
        remote: true
      },

      {
        text: "Ann, can we at least discuss it?",
        chatter: 'Ryuji',
        newChatter: true,
        remote: true
      },

      {
        text: "It doesn't work that way once Hifumi's mind is set.",
        chatter: 'Ren',
        newChatter: true,
        remote: false
      },

      {
        text: "YOU WHORE!",
        chatter: 'Sumire',
        newChatter: true,
        remote: true
      },
    ],
    isTyping: [
      {
        text: "...",
        chatter: 'Yuskue',
        remote: true
      },
    ],
    interval: undefined,
    index: 0, 
    isPausedNow: false
  };

  },
  watch: {
    async messages(_newMessages, _oldMessages) {
      if (this.queue.length === 0) {
        clearInterval(this.interval);
      }

      var oldIndex = this.index
      await this.interval;
      this.index.change = oldIndex + 1


      if (document.body !== null) {
        TweenMax.to(window, 1, { scrollTo: { y: document.body.scrollHeight }, ease: Power3.easeOut });
      }
    } },

  mounted() {
//    this.interval = setInterval(() => {
//      this.messages.push(this.queue.shift());
//    }, 2000);
    var isPaused = false;
    var lastMessage = this.messages[this.messages.length - 1];
    var msgIndex = this.index;
    var nextMessage = this.queue[msgIndex];
    var nextMsgLength = (nextMessage.text.length);
    var rate = 200;
    var pause = 100;
    this.interval =
      setInterval(() => {
        this.messages.push(this.queue.shift());
    }, 2000);

  } 
}
);

document.scrollingElement.scroll(0, 1);

