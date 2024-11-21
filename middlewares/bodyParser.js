import bodyParser from "body-parser";

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended:true });

export default {
    jsonParser,
    urlencodedParser
}