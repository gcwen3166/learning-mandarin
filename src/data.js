export const lessonsData = [
  {
    id: 1,
    title: "Lesson 1: 学做人",
    description: "",
    videoUrl: "https://www.youtube.com/embed/9DpI-vfirkY",
    content: [
      // 1. New Header: "Lesson"
      { 
        type: "section-header", 
        english: "Lesson" 
      },

      // --- TITLE ---
      { 
        type: "title", 
        english: "",
        segments: [
          { char: "1", py: "" }, 
          { char: " ", py: "" }, 
          { char: "学", py: "xué" }, 
          { char: "做", py: "zuò" }, 
          { char: "人", py: "rén" }
        ]
      },

      // --- MAIN POEM ---
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "少", py: "shào" }, { char: "年", py: "nián" }, { char: "强", py: "qiáng" },
          { char: "，", py: "" },
          { char: "立", py: "lì" }, { char: "志", py: "zhì" }, { char: "早", py: "zǎo" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "学", py: "" }, { char: "做", py: "" }, { char: "人", py: "" },
          { char: "，", py: "" },
          { char: "读", py: "dú" }, { char: "书", py: "shū" }, { char: "好", py: "hǎo" }
        ]
      },

      { type: "break" }, 

      // 2. New Header: "Review Phrases & Sentences"
      { 
        type: "section-header", 
        english: "Review Phrases & Sentences" 
      },

      // --- VOCAB GROUPS (NO PINYIN) ---
      // Notice: py is set to "" for all characters here
      { 
        type: "ruby-line", 
        english: "",
        segments: [
          { char: "少", py: "" }, { char: "年", py: "" }, { char: "，", py: "" },
          { char: "立", py: "" }, { char: "志", py: "" }, { char: "，", py: "" },
          { char: "做", py: "" }, { char: "人", py: "" }, { char: "，", py: "" },
          { char: "读", py: "" }, { char: "书", py: "" }, { char: "，", py: "" },
          { char: "早", py: "" }, { char: "读", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "好", py: "" }, { char: "人", py: "" }, { char: "，", py: "" },
          { char: "好", py: "" }, { char: "书", py: "" }, { char: "，", py: "" },
          { char: "人", py: "" }, { char: "好", py: "" }, { char: "，", py: "" },
          { char: "书", py: "" }, { char: "好", py: "" }, { char: "，", py: "" },
          { char: "学", py: "" }, { char: "好", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "读", py: "" }, { char: "书", py: "" }, { char: "好", py: "" }, { char: "，", py: "" },
          { char: "读", py: "" }, { char: "好", py: "" }, { char: "书", py: "" }, { char: "，", py: "" },
          { char: "书", py: "" }, { char: "读", py: "" }, { char: "好", py: "" }, { char: "。", py: "" },
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "少", py: "" }, { char: "年", py: "" }, { char: "强", py: "" }, { char: "，", py: "" },
          { char: "读", py: "" }, { char: "好", py: "" }, { char: "书", py: "" }, { char: "。", py: "" },
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "少年学做人，学做好人。", py: "" },
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "少年立志早，做人读书好。", py: "" },
        ]
      },
      // ... (Repeat for other review lines, setting py: "" for all of them) ...
      
    ],
    
    // Words array is correctly placed inside the object! (This part is GOOD)
    words: [
      { 
        id: 1, hanzi: "少年", pinyin: "shào nián", pinyinNum: "shao4 nian2", english: "Youth / Young person",
        exampleHanzi: "这位少年喜欢读书。", examplePinyin: "Zhè wèi shào nián xǐ huan dú shū.", exampleEnglish: "This young person likes reading."
      },
      { 
        id: 2, hanzi: "立志", pinyin: "lì zhì", pinyinNum: "li4 zhi4", english: "To set a goal / To resolve",
        exampleHanzi: "我们要立志做一个好人。", examplePinyin: "Wǒ men yào lì zhì zuò yī gè hǎo rén.", exampleEnglish: "We must resolve to be good people."
      },
      { 
        id: 4, hanzi: "做人", pinyin: "zuò rén", pinyinNum: "zuo4 ren2", english: "To conduct oneself",
        exampleHanzi: "学做人比读书更重要。", examplePinyin: "Xué zuò rén bǐ dú shū gèng zhòng yào.", exampleEnglish: "Learning character is more important than studying."
      },
      { 
        id: 5, hanzi: "读书", pinyin: "dú shū", pinyinNum: "du2 shu1", english: "To read books / to study",
        exampleHanzi: "早上是读书的好时间。", examplePinyin: "Zǎo shang shì dú shū de hǎo shí jiān.", exampleEnglish: "Morning is a good time for reading."
      },
      { 
        id: 6, hanzi: "早读", pinyin: "zǎo dú", pinyinNum: "zao3 du2", english: "Early reading",
        exampleHanzi: "我们每天都有早读课。", examplePinyin: "Wǒ men měi tiān dōu yǒu zǎo dú kè.", exampleEnglish: "We have early reading class every day."
      },
      { 
        id: 7, hanzi: "好人", pinyin: "hǎo rén", pinyinNum: "hao3 ren2", english: "Good person",
        exampleHanzi: "他是一个好人。", examplePinyin: "Tā shì yī gè hǎo rén.", exampleEnglish: "He is a good person."
      },
      { 
        id: 8, hanzi: "好书", pinyin: "hǎo shū", pinyinNum: "hao3 shu1", english: "Good books",
        exampleHanzi: "这是一本难得的好书。", examplePinyin: "Zhè shì yī běn nán dé de hǎo shū.", exampleEnglish: "This is a rare good book."
      },
      { 
        id: 9, hanzi: "人好", pinyin: "rén hǎo", pinyinNum: "ren2 hao3", english: "Person is good",
        exampleHanzi: "他的为人很好。", examplePinyin: "Tā de wéi rén hěn hǎo.", exampleEnglish: "His character is very good."
      },
      { 
        id: 10, hanzi: "书好", pinyin: "shū hǎo", pinyinNum: "shu1 hao3", english: "Book is good",
        exampleHanzi: "读书好，读好书。", examplePinyin: "Dú shū hǎo, dú hǎo shū.", exampleEnglish: "Reading is good, read good books."
      },
      { 
        id: 11, hanzi: "学好", pinyin: "xué hǎo", pinyinNum: "xue2 hao3", english: "To learn well",
        exampleHanzi: "我们要学好中文。", examplePinyin: "Wǒ men yào xué hǎo Zhōng wén.", exampleEnglish: "We must learn Chinese well."
      },
    ]
  },
  // ... other lessons

  {
    id: 2,
    title: "Lesson 2: 我有责",
    description: "",
    videoUrl: "https://www.youtube.com/embed/u7zTf50kVHk",
    content: [
      // 1. New Header: "Lesson"
      { 
        type: "section-header", 
        english: "Lesson" 
      },

      // --- TITLE ---
      { 
        type: "title", 
        english: "",
        segments: [
          { char: "2", py: "" }, 
          { char: " ", py: "" }, 
          { char: "我", py: "wǒ" }, 
          { char: "有", py: "yǒu" }, 
          { char: "责", py: "zé" }
        ]
      },

      // --- MAIN POEM ---
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "长", py: "wǒ" }, { char: "身", py: "yǒu" }, { char: "体", py: "zé" },
          { char: "，", py: "" },
          { char: "正", py: "zhèng" }, { char: "品", py: "pǐn" }, { char: "格", py: "gé" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "国", py: "guó" }, { char: "家", py: "jiā" }, { char: "兴", py: "xīng" },
          { char: "，", py: "" },
          { char: "我", py: "" }, { char: "有", py: "" }, { char: "责", py: "" }
        ]
      },

      { type: "break" }, 

      // 2. New Header: "Review Phrases & Sentences"
      { 
        type: "section-header", 
        english: "Review Phrases & Sentences" 
      },

      // --- VOCAB GROUPS (NO PINYIN) ---
      // Notice: py is set to "" for all characters here
      { 
        type: "ruby-line", 
        english: "",
        segments: [
          { char: "身体", py: "" }, { char: "，", py: "" },
          { char: "品格", py: "" }, { char: "，", py: "" },
          { char: "国家", py: "" }, { char: "，", py: "" },
          { char: "体格", py: "" }, { char: "，", py: "" },
          { char: "人格", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "兴国", py: "" }, { char: "，", py: "" },
          { char: "正品", py: "" }, { char: "，", py: "" },
          { char: "立正", py: "" }, { char: "，", py: "" },
          { char: "人品", py: "" }, { char: "，", py: "" },
          { char: "强国", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "身体好", py: "" }, { char: "，", py: "" },
          { char: "品格正", py: "" }, { char: "。", py: "" },
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "我有家", py: "" }, { char: "，", py: "" },
          { char: "我家有", py: "" }, { char: "。", py: "" },
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "少年强", py: "" }, { char: "，", py: "" },
          { char: "国家强", py: "" }, { char: "。", py: "" },
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "我有好身体，我有好品格。", py: "" },
        ]
      },
      // ... (Repeat for other review lines, setting py: "" for all of them) ...

      { type: "break" },

      // --- REVIEW LESSONS SECTION ---
      { 
        type: "section-header", 
        english: "Review Lessons" 
      },
      {
        type: "info-box", // <--- NEW TYPE
        text: "Please review Lesson 1."
      }
    ],
    words: [
      { 
        id: 1, 
        hanzi: "身体", 
        pinyin: "shēn tǐ", 
        pinyinNum: "shen1 ti3", 
        english: "Body",
        exampleHanzi: "锻炼身体很重要。", 
        examplePinyin: "Duàn liàn shēn tǐ hěn zhòng yào.", 
        exampleEnglish: "Exercising the body is very important."
      },
      { 
        id: 2, 
        hanzi: "品格", 
        pinyin: "pǐn gé", 
        pinyinNum: "pin3 ge2", 
        english: "Character / Moral Quality",
        exampleHanzi: "他有高尚的品格。", 
        examplePinyin: "Tā yǒu gāo shàng de pǐn gé.", 
        exampleEnglish: "He has noble character."
      },
      { 
        id: 3, 
        hanzi: "国家", 
        pinyin: "guó jiā", 
        pinyinNum: "guo2 jia1", 
        english: "Country / Nation",
        exampleHanzi: "我爱我的国家。", 
        examplePinyin: "Wǒ ài wǒ de guó jiā.", 
        exampleEnglish: "I love my country."
      },
      { 
        id: 4, 
        hanzi: "体格", 
        pinyin: "tǐ gé", 
        pinyinNum: "ti3 ge2", 
        english: "Physique / Body build",
        exampleHanzi: "运动员的体格很强壮。", 
        examplePinyin: "Yùn dòng yuán de tǐ gé hěn qiáng zhuàng.", 
        exampleEnglish: "The athlete's physique is very strong."
      },
      { 
        id: 5, 
        hanzi: "人格", 
        pinyin: "rén gé", 
        pinyinNum: "ren2 ge2", 
        english: "Personality / Human Dignity",
        exampleHanzi: "我们要尊重他人的人格。", 
        examplePinyin: "Wǒ men yào zūn zhòng tā rén de rén gé.", 
        exampleEnglish: "We must respect the dignity of others."
      },
      { 
        id: 6, 
        hanzi: "兴国", 
        pinyin: "xīng guó", 
        pinyinNum: "xing1 guo2", 
        english: "Rejuvenate the country",
        exampleHanzi: "科技可以兴国。", 
        examplePinyin: "Kē jì kě yǐ xīng guó.", 
        exampleEnglish: "Technology can rejuvenate the country."
      },
      { 
        id: 7, 
        hanzi: "正品", 
        pinyin: "zhèng pǐn", 
        pinyinNum: "zheng4 pin3", 
        english: "Genuine product / Certified goods",
        exampleHanzi: "这家店只卖正品。", 
        examplePinyin: "Zhè jiā diàn zhǐ mài zhèng pǐn.", 
        exampleEnglish: "This store only sells genuine products."
      },
      { 
        id: 8, 
        hanzi: "立正", 
        pinyin: "lì zhèng", 
        pinyinNum: "li4 zheng4", 
        english: "Stand at attention",
        exampleHanzi: "听到口令请立正。", 
        examplePinyin: "Tīng dào kǒu lìng qǐng lì zhèng.", 
        exampleEnglish: "Please stand at attention when you hear the command."
      },
      { 
        id: 9, 
        hanzi: "人品", 
        pinyin: "rén pǐn", 
        pinyinNum: "ren2 pin3", 
        english: "Moral standing / Character",
        exampleHanzi: "交朋友要看人品。", 
        examplePinyin: "Jiāo péng yǒu yào kàn rén pǐn.", 
        exampleEnglish: "Look at moral character when making friends."
      },
      { 
        id: 10, 
        hanzi: "强国", 
        pinyin: "qiáng guó", 
        pinyinNum: "qiang2 guo2", 
        english: "Powerful nation",
        exampleHanzi: "少年强则国强。", 
        examplePinyin: "Shào nián qiáng zé guó qiáng.", 
        exampleEnglish: "If the youth are strong, the country is strong."
      }
    ]
  },
  {
    id: 3,
    title: "Lesson 3: 一二三",
    description: "",
    videoUrl: "https://www.youtube.com/embed/ApqFjTxdJ18",
    content: [
      // 1. New Header: "Lesson"
      { 
        type: "section-header", 
        english: "Lesson" 
      },

      // --- TITLE ---
      { 
        type: "title", 
        english: "",
        segments: [
          { char: "3", py: "" }, 
          { char: " ", py: "" }, 
          { char: "一", py: "yī" }, 
          { char: "二", py: "èr" }, 
          { char: "三", py: "sān" }
        ]
      },

      // --- MAIN POEM ---
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "一", py: "" }, { char: "二", py: "" }, { char: "三", py: "" },
          { char: "，", py: "" },
          { char: "小", py: "xiǎo" }, { char: "大", py: "dà" }, { char: "尖", py: "jiān" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "天", py: "tiān" }, { char: "夫", py: "fū" }, { char: "太", py: "tài" },{ char: "，", py: "" },
          { char: "火", py: "huǒ" }, { char: "因", py: "yīn" }, { char: "烟", py: "yān" }
        ]
      },

      { type: "break" }, 

      // 2. New Header: "Review Phrases & Sentences"
      { 
        type: "section-header", 
        english: "Review Phrases & Sentences" 
      },

      // --- VOCAB GROUPS (NO PINYIN) ---
      // Notice: py is set to "" for all characters here
      { 
        type: "ruby-line", 
        english: "",
        segments: [
          { char: "大人", py: "" }, { char: "，", py: "" },
          { char: "三天", py: "" }, { char: "，", py: "" },
          { char: "小学", py: "" }, { char: "，", py: "" },
          { char: "强大", py: "" }, { char: "，", py: "" },
          { char: "太大", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "大学", py: "" }, { char: "，", py: "" },
          { char: "夫人", py: "" }, { char: "，", py: "" },
          { char: "烟火", py: "" }, { char: "，", py: "" },
          { char: "天天", py: "" }, { char: "，", py: "" },
          { char: "大家", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "一学强身好，二学读书好", py: "" }, { char: "。", py: "" },
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "三学做人好，人人学三好", py: "" }, { char: "。", py: "" },
        ]
      },
      // ... (Repeat for other review lines, setting py: "" for all of them) ...

      { type: "break" },

      // --- CONNECT & COMPARE SECTION ---
      { 
        type: "section-header", 
        english: "Connect & Compare" 
      },
      {
        type: "compare-grid",
        groups: [
          ["天", "夫"],          // Group of 2
          ["大", "太"],          // Group of 2
          ["因", "国"],    // Group of 2 (New!)
          ["小", "少"],    // Group of 2 (New!)
        ]
      },

      { type: "break" },

      // --- REVIEW LESSONS SECTION ---
      { 
        type: "section-header", 
        english: "Review Lessons" 
      },
      {
        type: "info-box", // <--- NEW TYPE
        text: "Please review Lesson 2."
      }
      
    ],
    
    // Words array is correctly placed inside the object! (This part is GOOD)
    words: [
      { 
        id: 1, hanzi: "大人", pinyin: "dà rén", pinyinNum: "da4 ren2", english: "Adult",
        exampleHanzi: "小孩要听大人的话。", 
        examplePinyin: "Xiǎo hái yào tīng dà rén de huà.", 
        exampleEnglish: "Children should listen to adults."
      },
      { 
        id: 2, hanzi: "三天", pinyin: "sān tiān", pinyinNum: "san1 tian1", english: "Three days",
        exampleHanzi: "我去了北京三天。", 
        examplePinyin: "Wǒ qù le Běi jīng sān tiān.", 
        exampleEnglish: "I went to Beijing for three days."
      },
      { 
        id: 4, hanzi: "小学", pinyin: "xiǎo xué", pinyinNum: "xiao3 xue2", english: "Elementary School",
        exampleHanzi: "我的弟弟上小学。", 
        examplePinyin: "Wǒ de dì di shàng xiǎo xué.", 
        exampleEnglish: "My younger brother attends elementary school."
      },
      { 
        id: 5, hanzi: "强大", pinyin: "qiáng dà", pinyinNum: "qiang2 da4", english: "Powerful / Strong",
        exampleHanzi: "知识让我们强大。", 
        examplePinyin: "Zhī shi ràng wǒ men qiáng dà.", 
        exampleEnglish: "Knowledge makes us powerful."
      },
      { 
        id: 6, hanzi: "太大", pinyin: "tài dà", pinyinNum: "tai4 da4", english: "Too big",
        exampleHanzi: "这件衣服太大了。", 
        examplePinyin: "Zhè jiàn yī fu tài dà le.", 
        exampleEnglish: "This piece of clothing is too big."
      },
      { 
        id: 7, hanzi: "大学", pinyin: "dà xué", pinyinNum: "da4 xue2", english: "University / College",
        exampleHanzi: "她考上了大学。", 
        examplePinyin: "Tā kǎo shàng le dà xué.", 
        exampleEnglish: "She got accepted into university."
      },
      { 
        id: 8, hanzi: "夫人", pinyin: "fū rén", pinyinNum: "fu1 ren2", english: "Madame / Mrs.",
        exampleHanzi: "这位是李夫人。", 
        examplePinyin: "Zhè wèi shì Lǐ fū rén.", 
        exampleEnglish: "This is Madame Li."
      },
      { 
        id: 9, hanzi: "烟火", pinyin: "yān huǒ", pinyinNum: "yan1 huo3", english: "Fireworks",
        exampleHanzi: "新年的烟火很美。", 
        examplePinyin: "Xīn nián de yān huǒ hěn měi.", 
        exampleEnglish: "The New Year's fireworks are beautiful."
      },
      { 
        id: 10, hanzi: "天天", pinyin: "tiān tiān", pinyinNum: "tian1 tian1", english: "Every day",
        exampleHanzi: "我们天天学习中文。", 
        examplePinyin: "Wǒ men tiān tiān xué xí Zhōng wén.", 
        exampleEnglish: "We study Chinese every day."
      },
      { 
        id: 11, hanzi: "大家", pinyin: "dà jiā", pinyinNum: "da4 jia1", english: "Everyone",
        exampleHanzi: "大家好！", 
        examplePinyin: "Dà jiā hǎo!", 
        exampleEnglish: "Hello everyone!"
      }
    ]
  },
  {
    id: 4,
    title: "Lesson 4: 田力男",
    description: "",
    videoUrl: "https://www.youtube.com/embed/ApqFjTxdJ18",
    content: [
      // 1. New Header: "Lesson"
      { 
        type: "section-header", 
        english: "Lesson" 
      },

      // --- TITLE ---
      { 
        type: "title", 
        english: "",
        segments: [
          { char: "4", py: "" }, 
          { char: " ", py: "" }, 
          { char: "田", py: "tián" }, 
          { char: "力", py: "lì" }, 
          { char: "男", py: "nán" }
        ]
      },

      // --- MAIN POEM ---
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "田", py: "" }, { char: "力", py: "" }, { char: "男", py: "" }, { char: "，", py: "" },
          { char: "不", py: "bú" }, { char: "正", py: "" }, { char: "歪", py: "wāi" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "竹", py: "zhú" }, { char: "干", py: "gàn" }, { char: "杆", py: "gān" },{ char: "，", py: "" },
          { char: "土", py: "tǔ" }, { char: "里", py: "lǐ" }, { char: "埋", py: "mái" }
        ]
      },

      { type: "break" }, 

      // 2. New Header: "Review Phrases & Sentences"
      { 
        type: "section-header", 
        english: "Review Phrases & Sentences" 
      },

      // --- VOCAB GROUPS (NO PINYIN) ---
      // Notice: py is set to "" for all characters here
      { 
        type: "ruby-line", 
        english: "",
        segments: [
          { char: "土里", py: "" }, { char: "，", py: "" },
          { char: "国土", py: "" }, { char: "，", py: "" },
          { char: "体力", py: "" }, { char: "，", py: "" },
          { char: "竹竿", py: "" }, { char: "，", py: "" },
          { char: "立正", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "埋好", py: "" }, { char: "，", py: "" },
          { char: "竹尖", py: "" }, { char: "，", py: "" },
          { char: "大力", py: "" }, { char: "，", py: "" },
          { char: "强大", py: "" }, { char: "，", py: "" },
          { char: "人力", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "竹竿埋土里，正不正？", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "竹竿埋正了，不歪。", py: "" }, 
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "一人力小，二人力大，三人力强大。", py: "" }
        ]
      },
      // ... (Repeat for other review lines, setting py: "" for all of them) ...
      { type: "break" },

      // --- CONNECT & COMPARE SECTION ---
      { 
        type: "section-header", 
        english: "Connect & Compare" 
      },
      {
        type: "compare-grid",
        groups: [
          ["土", "干"],          // Group of 2
          ["男", "里"],          // Group of 2
          ["力", "立", "里"],    // Group of 3 (New!)
        ]
      },

      { type: "break" },

      // --- REVIEW LESSONS SECTION ---
      { 
        type: "section-header", 
        english: "Review Lessons" 
      },
      {
        type: "info-box", // <--- NEW TYPE
        text: "Please review Lesson 1 and Lesson 3."
      }
      
    ],
    
    // Words array is correctly placed inside the object! (This part is GOOD)
    words: [
      { 
        id: 1, hanzi: "田里", pinyin: "tián lǐ", pinyinNum: "tian2 li3", english: "In the field / Farm",
        exampleHanzi: "农民在田里工作。", 
        examplePinyin: "Nóng mín zài tián lǐ gōng zuò.", 
        exampleEnglish: "Farmers work in the fields."
      },
      { 
        id: 2, hanzi: "国土", pinyin: "guó tǔ", pinyinNum: "guo2 tu3", english: "Territory / Land",
        exampleHanzi: "保卫国家的国土。", 
        examplePinyin: "Bǎo wèi guó jiā de guó tǔ.", 
        exampleEnglish: "Defend the country's territory."
      },
      { 
        id: 4, hanzi: "体力", pinyin: "tǐ lì", pinyinNum: "ti3 li4", english: "Physical strength",
        exampleHanzi: "跑步需要很好的体力。", 
        examplePinyin: "Pǎo bù xū yào hěn hǎo de tǐ lì.", 
        exampleEnglish: "Running requires good physical strength."
      },
      { 
        id: 5, hanzi: "竹竿", pinyin: "zhú gàn", pinyinNum: "zhu2 gan1", english: "Bamboo pole",
        exampleHanzi: "他拿着一根竹竿。", 
        examplePinyin: "Tā ná zhe yī gēn zhú gān.", 
        exampleEnglish: "He is holding a bamboo pole."
      },
      { 
        id: 6, hanzi: "立正", pinyin: "lì zhèng", pinyinNum: "li4 zheng4", english: "Stand at attention",
        exampleHanzi: "听到口令请立正。", 
        examplePinyin: "Tīng dào kǒu lìng qǐng lì zhèng.", 
        exampleEnglish: "Please stand at attention upon hearing the command."
      },
      { 
        id: 7, hanzi: "埋好", pinyin: "mái hǎo", pinyinNum: "mai2 hao3", english: "Bury well",
        exampleHanzi: "把种子埋好在土里。", 
        examplePinyin: "Bǎ zhǒng zi mái hǎo zài tǔ lǐ.", 
        exampleEnglish: "Bury the seeds well in the soil."
      },
      { 
        id: 8, hanzi: "竹尖", pinyin: "zhú jiān", pinyinNum: "zhu2 jian1", english: "Bamboo tip",
        exampleHanzi: "竹尖很尖锐。", 
        examplePinyin: "Zhú jiān hěn jiān ruì.", 
        exampleEnglish: "The tip of the bamboo is very sharp."
      },
      { 
        id: 9, hanzi: "大力", pinyin: "dà lì", pinyinNum: "da4 li4", english: "Great effort / Vigorously",
        exampleHanzi: "我们要大力支持环保。", 
        examplePinyin: "Wǒ men yào dà lì zhī chí huán bǎo.", 
        exampleEnglish: "We must vigorously support environmental protection."
      },
      { 
        id: 10, hanzi: "强大", pinyin: "qiáng dà", pinyinNum: "qiang2 da4", english: "Powerful / Strong",
        exampleHanzi: "内心强大最重要。", 
        examplePinyin: "Nèi xīn qiáng dà zuì zhòng yào.", 
        exampleEnglish: "Being strong on the inside is most important."
      },
      { 
        id: 11, hanzi: "人力", pinyin: "rén lì", pinyinNum: "ren2 li4", english: "Manpower",
        exampleHanzi: "这需要很多人力。", 
        examplePinyin: "Zhè xū yào hěn duō rén lì.", 
        exampleEnglish: "This requires a lot of manpower."
      }
    ]
  },
  {
    id: 5,
    title: "Lesson 5: 日生星",
    description: "",
    videoUrl: "https://www.youtube.com/embed/ApqFjTxdJ18",
    content: [
      // 1. New Header: "Lesson"
      { 
        type: "section-header", 
        english: "Lesson" 
      },

      // --- TITLE ---
      { 
        type: "title", 
        english: "",
        segments: [
          { char: "5", py: "" }, 
          { char: " ", py: "" }, 
          { char: "日", py: "rì" }, 
          { char: "生", py: "shēng" }, 
          { char: "星", py: "xīng" }
        ]
      },

      // --- MAIN POEM ---
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "日", py: "" }, { char: "生", py: "" }, { char: "星", py: "" }, { char: "，", py: "" },
          { char: "立", py: "" }, { char: "占", py: "zhàn" }, { char: "站", py: "zhàn" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "足", py: "zú" }, { char: "包", py: "bāo" }, { char: "跑", py: "pǎo" },{ char: "，", py: "" },
          { char: "车", py: "chē" }, { char: "专", py: "zhuān" }, { char: "转", py: "zhuàn" }
        ]
      },

      { type: "break" }, 

      // 2. New Header: "Review Phrases & Sentences"
      { 
        type: "section-header", 
        english: "Review Phrases & Sentences" 
      },

      // --- VOCAB GROUPS (NO PINYIN) ---
      // Notice: py is set to "" for all characters here
      { 
        type: "ruby-line", 
        english: "",
        segments: [
          { char: "生日", py: "" }, { char: "，", py: "" },
          { char: "站立", py: "" }, { char: "，", py: "" },
          { char: "专家", py: "" }, { char: "，", py: "" },
          { char: "占有", py: "" }, { char: "，", py: "" },
          { char: "转身", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "男车", py: "" }, { char: "，", py: "" },
          { char: "星星", py: "" }, { char: "，", py: "" },
          { char: "车站", py: "" }, { char: "，", py: "" },
          { char: "包车", py: "" }, { char: "，", py: "" },
          { char: "专车", py: "" }, { char: "，", py: "" }
        ]
      },
      { 
        type: "ruby-line", 
        english: "", 
        segments: [
          { char: "车站里有好米，有专车", py: "" }
        ]
      },
      // ... (Repeat for other review lines, setting py: "" for all of them) ...
      { type: "break" },

      // --- CONNECT & COMPARE SECTION ---
      { 
        type: "section-header", 
        english: "Connect & Compare" 
      },
      {
        type: "compare-grid",
        groups: [
          ["兴", "星"],          // Group of 2
          ["专", "转", "站"],    // Group of 3 (New!)
        ]
      },

      { type: "break" },

      // --- REVIEW LESSONS SECTION ---
      { 
        type: "section-header", 
        english: "Review Lessons" 
      },
      {
        type: "info-box", // <--- NEW TYPE
        text: "Please review Lesson 2 and Lesson 4."
      }
      
    ],
    
    // Words array is correctly placed inside the object! (This part is GOOD)
    words: [
      { 
        id: 1, hanzi: "生日", pinyin: "shēng rì", pinyinNum: "sheng1 ri4", english: "Birthday",
        exampleHanzi: "祝你生日快乐！", 
        examplePinyin: "Zhù nǐ shēng rì kuài lè!", 
        exampleEnglish: "Happy birthday to you!"
      },
      { 
        id: 2, hanzi: "站立", pinyin: "zhàn lì", pinyinNum: "zhan4 li4", english: "To stand / Standing",
        exampleHanzi: "请大家起立站好。", 
        examplePinyin: "Qǐng dà jiā qǐ lì zhàn hǎo.", 
        exampleEnglish: "Everyone please stand up properly."
      },
      { 
        id: 3, 
        hanzi: "专家", 
        pinyin: "zhuān jiā", 
        pinyinNum: "zhuan1 jia1", 
        english: "Expert / Specialist",
        exampleHanzi: "他是这方面的专家。", 
        examplePinyin: "Tā shì zhè fāng miàn de zhuān jiā.", 
        exampleEnglish: "He is an expert in this field."
      },
      { 
        id: 4, hanzi: "占有", pinyin: "zhàn yǒu", pinyinNum: "zhan4 you3", english: "To possess / To occupy",
        exampleHanzi: "他想占有这个座位。", 
        examplePinyin: "Tā xiǎng zhàn yǒu zhè ge zuò wèi.", 
        exampleEnglish: "He wants to occupy this seat."
      },
      { 
        id: 5, hanzi: "转身", pinyin: "zhuǎn shēn", pinyinNum: "zhuan3 shen1", english: "Turn around",
        exampleHanzi: "他转身就走了。", 
        examplePinyin: "Tā zhuǎn shēn jiù zǒu le.", 
        exampleEnglish: "He turned around and left."
      },
      { 
        id: 6, hanzi: "男车", pinyin: "nán chē", pinyinNum: "nan2 che1", english: "Male Car (Typo?)", 
        // Note: This is likely a typo for "单车" (Bicycle) or "男生" (Boy). 
        // I have provided a literal sentence below.
        exampleHanzi: "那是男车厢。", 
        examplePinyin: "Nà shì nán chē xiāng.", 
        exampleEnglish: "That is the men's carriage."
      },
      { 
        id: 7, hanzi: "星星", pinyin: "xīng xing", pinyinNum: "xing1 xing5", english: "Star",
        exampleHanzi: "天上的星星很亮。", 
        examplePinyin: "Tiān shang de xīng xing hěn liàng.", 
        exampleEnglish: "The stars in the sky are very bright."
      },
      { 
        id: 8, hanzi: "车站", pinyin: "chē zhàn", pinyinNum: "che1 zhan4", english: "Station / Bus Stop",
        exampleHanzi: "我在车站等你。", 
        examplePinyin: "Wǒ zài chē zhàn děng nǐ.", 
        exampleEnglish: "I will wait for you at the station."
      },
      { 
        id: 9, hanzi: "包车", pinyin: "bāo chē", pinyinNum: "bao1 che1", english: "Chartered vehicle",
        exampleHanzi: "我们要包车去旅游。", 
        examplePinyin: "Wǒ men yào bāo chē qù lǚ yóu.", 
        exampleEnglish: "We want to charter a car for the trip."
      },
      { 
        id: 10, hanzi: "专车", pinyin: "zhuān chē", pinyinNum: "zhuan1 che1", english: "Special car / Chauffeur",
        exampleHanzi: "专门接送的专车到了。", 
        examplePinyin: "Zhuān mén jiē sòng de zhuān chē dào le.", 
        exampleEnglish: "The dedicated pick-up car has arrived."
      }
    ]
  },
];