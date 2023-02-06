
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
        text: "Valentine's Day is coming up... do any of you have any plans?",
        chatter: 'Haru',
        remote: true
      },

      {
        text: 'I wonder...',
        chatter: 'Ryuji',
        remote: true },

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
        text: "You're gonna be alone forever Ryuji...",
        chatter: 'Futaba',
        remote: true },

      {
        text: "Hey, don't bully him. It's not his fault.",
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
