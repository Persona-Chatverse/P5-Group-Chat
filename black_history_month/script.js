
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

        centerWidth: 300,
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
        x: 15,
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
        text: "Ann I'm at one of my NCAA competitions... and I have a question.",
        chatter: 'Sumire',
        remote: true
      },

      {
        text: 'Oh...',
        chatter: 'Ann',
        remote: true },

      {
        text: "Will she behave herself this time?",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Sumire, this better not be some racist shit again.",
        chatter: 'Ren',
        remote: false },

      {
        text: "What's this Black History Month bullshit? There's no such thing as Black History.",
        chatter: 'Sumire',
        remote: true },

      {
        text: "Jesus Christ!",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "Is it to celebrate Edgar Allen Poe?",
        chatter: 'Yuskue',
        remote: true },

      {
        text: "Poe was... Yuskue are you high again?",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Didn't he support slavery?",
        chatter: 'Haru',
        remote: true },

      {
        text: "Why do the gummy bears in Canada taste so good?",
        chatter: 'Yuskue',
        remote: true },

      {
        text: "I'm not good at history guys! I didn't go to college.",
        chatter: 'Ann',
        remote: true },

      {
        text: "He did... or maybe I'm thinking of Nathaniel Hawthorne.",
        chatter: 'Ren',
        remote: false },

      {
        text: "You're such a nerd.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Who let her in again?",
        chatter: 'Yuskue',
        remote: true },

      {
        text: "The King-Consort of the Togo Kingdom.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "GOD DAMMMMIT YOU WHORE! I HATE YOU, YOU SENPAI STEALING SLUT!",
        chatter: 'Sumire',
        remote: true },

      {
        text: "If it wasn't yours to begin with it isn't stealing.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Hey, calm down you two.",
        chatter: 'Ren',
        remote: false },

      {
        text: "Is this a cat fight?",
        chatter: 'Yuskue',
        remote: true },

      {
        text: "Don't bring up cats when Haru's in the chat.",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "DFHJGHIY8YIKHJN JKLNA96Y",
        chatter: 'Futaba',
        remote: true },

      {
        text: "It appears Futaba left the chat open again.",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Anyway, back on topic.",
        chatter: 'Ann',
        remote: true },

      {
        text: "Black History Month is a month where we celebrate the contributions African Americans made to the country.",
        chatter: 'Ann',
        remote: true },

      {
        text: "So crime rates?",
        chatter: 'Sumire',
        newChatter: false,
        remote: true },

      {
        text: "What did I just say?",
        chatter: 'Ren',
        remote: false },

      {
        text: "Barack Obama, Michael Jackson, Martin Luther...",
        chatter: 'Ann',
        remote: true },

      {
        text: "Martin Luther King, Ann.",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Michael Jackson was white, just like me and Ann.",
        chatter: 'Sumire',
        newChatter: false,
        remote: true },

      {
        text: "Hold on...",
        chatter: 'Ren',
        remote: false },

      {
        text: "I'm half-white.",
        chatter: 'Ann',
        remote: true },

      {
        text: "I... fuck...",
        chatter: 'Makoto',
        remote: true },

      {
        text: "My sister in Christ, you're Japanese. Asian. You're not white.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Shut it, Admiral Bimboki Tojo.",
        chatter: 'Sumire',
        newChatter: false,
        remote: true },

      {
        text: "Who's that?",
        chatter: 'Yuskue',
        remote: true },

      {
        text: "Go eat some dogs.",
        chatter: 'Sumire',
        newChatter: false,
        remote: true },

      {
        text: "FFS now she's being racist towards her own people!",
        chatter: 'Makoto',
        remote: true },

      {
        text: "What the hell is happening?",
        chatter: 'Futaba',
        remote: true },

      {
        text: "Sumire.",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Just typical Sumire shit.",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "She's going on another racist tirade.",
        chatter: 'Ren',
        remote: false },

      {
        text: "Go back to your rice fields you chunni bitch!",
        chatter: 'Sumire',
        remote: true },

      {
        text: "So she's being a cunt again?",
        chatter: 'Futaba',
        remote: true },

      {
        text: "That's a little mean.",
        chatter: 'Haru',
        remote: true },

      {
        text: "Oh, are you feelings hurt, princess?",
        chatter: 'Sumire',
        remote: true },

      {
        text: "Calling you names is not a nice thing to do, I am just helping.",
        chatter: 'Haru',
        remote: true },

      {
        text: "Haru, it isn't worth it.",
        chatter: 'Makoto',
        remote: true },

      {
        text: "You know what?",
        chatter: 'Sumire',
        remote: true },

      {
        text: "I'm glad Akechi-kun killed your dad, you coal digger.",
        chatter: 'Sumire',
        remote: true },

      {
        text: "WHAT IS WRONG WITH YOU?",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Holy shit, this is amazing.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Sometimes you scare me, Hifumi.",
        chatter: 'Ren',
        remote: false },

      {
        text: "We should've dropped more atomic bombs on the Japs.",
        chatter: 'Sumire',
        remote: true },

      {
        text: "Bitch, you ARE Japanese. Getting that scholarship to Stanford doesn't make you American!",
        chatter: 'Futaba',
        remote: true },

      {
        text: "No. Let her keep digging a hole. It is quite entertaining.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Listen here, slut. The only reason you're even here to bear witness to my grandure is because you let MY SENPAI enter your hole.",
        chatter: 'Sumire',
        remote: true },

      {
        text: "Do you have CTE?",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Wait... is that true?",
        chatter: 'Ryuji',
        remote: true },

      {
        text: "No! Hifumi's like... Catholic or something. We haven't done that.",
        chatter: 'Ren',
        remote: false },

      {
        text: "I mean, I'm not religious but I have little interest in premarital sex.",
        chatter: 'Hifumi',
        remote: true },

      {
        text: "Femcel.",
        chatter: 'Futaba',
        remote: true },

      {
        text: "Sumire, this is why we didn't take you on that trip.",
        chatter: 'Makoto',
        remote: true },

      {
        text: "You aren't even a good cop, you haven't shot any black people.",
        chatter: 'Sumire',
        remote: true },

      {
        text: "And....",
        chatter: 'Futaba',
        remote: true },

      {
        text: "Sumire has been timed out for a week. Imma go back to sleep.",
        chatter: 'Futaba',
        remote: true },

      {
        text: "THANK YOU!",
        chatter: 'Makoto',
        remote: true },

      {
        text: "Well... that was...",
        chatter: 'Ann',
        remote: true },

      {
        text: "Has anyone had lobsters lately?",
        chatter: 'Yuskue',
        remote: true },

      ],


      interval: undefined };

  },
  watch: {
    async messages(newMessages, oldMessages) {
      if (this.queue.length === 0) {
        clearInterval(this.interval);
      }
      await Vue.nextTick();
      const messages = this.$refs.chatMessages;
      const lastMessage = messages[messages.length - 1];
      // TODO: Draw the message trail.

      if (document.body !== null) {
        TweenMax.to(window, 1, { scrollTo: { y: document.body.scrollHeight }, ease: Power3.easeOut });
      }
    } },

  mounted() {
    this.interval = setInterval(() => {
      this.messages.push(this.queue.shift());
    }, 2000);
  } });

document.scrollingElement.scroll(0, 1);
