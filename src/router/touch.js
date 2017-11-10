/**
 * Created by Emonice on 2017/11/10.
 */
module.exports = router => {

    router.get('/touch', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Strict-Transport-Security');
        res.json('touch');
    });

    router.post('/touch', (req, res) => {
        res.set('Access-Control-Expose-Headers', 'Strict-Transport-Security');
        res.json('touch');
    });

    router.get('/url', (req, res) => {
        res.send_data(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    })
};