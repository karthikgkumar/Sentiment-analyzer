const express = require("express");
const natural = require("natural");
const aposToLexForm = require("apos-to-lex-form");
const SpellCorrector = require("spelling-corrector");
const SW = require("stopword");

const router = express.Router();
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

router.post("/s-analyzer", function (req, res, next) {
  try{
    console.log("inside try")
    const { r } = req.body;
    console.log(r)
    let reviwes50 = "";
    for (const review of r) {
      reviwes50 += review.trim() + "\n";
    }
    console.log(reviwes50);
  const lexedReview = aposToLexForm(reviwes50);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, "");

  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
  tokenizedReview.forEach((word, index) => {
    tokenizedReview[index] = spellCorrector.correct(word);
  });
  const filteredReview = SW.removeStopwords(tokenizedReview);
  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const analysis = analyzer.getSentiment(filteredReview);
  console.log(analysis)
  res.status(200).json({ analysis });
  }catch(err){
    console.log(err)
    res.status(422)
  }
  
});

module.exports = router;
