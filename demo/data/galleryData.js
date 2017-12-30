// http://picsum.photos/

const pics = {};

for (let n = 1; n <= 10; n++) {
    pics[n.toString()] = {
        url: `https://picsum.photos/200/300?image=${n - 1}`
    };
}

export default pics;
