const cheerio = require('cheerio');
const axios = require('axios')

const inShortUrl = "https://www.inshorts.com/en/read/"
const cardSel = "body > div.container > div > div.card-stack > div"

let detail = {}

async function news(req, res, next){
    let url = inShortUrl;
    let sel = cardSel

    if(req.query.category != 'all'){
        url = inShortUrl+req.query.category
    }

    let newsCards = []
    
    try{
        await axios.get(url).then((res)=>{
            const $ = cheerio.load(res.data);
            const selector = sel;
    
            $(selector).each((index, elem)=>{
                let card = $(elem).find('.news-card')
                let imageSrc = card.find('.news-card-image').attr('style')
                let title = card.find('span[itemprop="headline"]').text();
                let content = card.find('div[itemprop="articleBody"]').text().replace('\\',"");
                let date = card.find('span[clas="date"]').text()
                let time = card.find('span[itemprop="datePublished"]').text();
                let readMore = card.find('.source').attr('href');
                let newsSrc = card.find('.source').text();

                if(imageSrc != undefined){
                    imageSrc = imageSrc.slice(23,imageSrc.length-2);
                    newsCards.push({
                        title:title,
                        image:imageSrc,
                        content:content,
                        date:date,
                        time:time,
                        newsSource: newsSrc,
                        readMoreLink:readMore,
                    })
                }
    
                
            })
        })
    }catch(err){
        console.error(err);
    }
   
    detail = {
        category:req.query.category,
        allArticle: newsCards
    }
    res.send(detail);
   next();
}

module.exports = {news, detail}
