const User = require('../../models/user');
const jwt = require('jsonwebtoken');
exports.signup = (req, res)=>{
    User.findOne({email : req.body.email}).exec((err, user)=>{
        if(user) return res.status(400).json({
            message: 'Admin already registered'
        });

        const{
            firstName,
            lastName,
            email,
            password, 
        } = req.body;

        const _user = new User({
            firstName,
            lastName,
            email,
            password, 
            username : Math.random().toString(),
            role: 'admin'
        });

        _user.save((err,data)=>{
            if(err){
                return res.status(400).json({
                    message: 'Something is wrong'
                });
            }
            if(data){
                 return res.status(201).json({
                    message: 'Admin created Successfully...!'
                   
                 });
             }
        });
});

}

exports.signin = (req, res) =>{
    User.findOne({email: req.body.email}).exec((err, user)=>{
        if(err) {return res.status(400).json({
                message: 'Something went wrong'
            });
        }

        if(user){
            if(user.authenticate(req.body.password) && user.role==='admin'){
                const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
                const{_id,firstName, lastName, role, fullName, email} = user;
                return res.status(200).json({
                    token,
                    user: {
                        _id,firstName, lastName, role, fullName, email
                    }
                });
            }else{
                return res.status(400).json({
                    message: 'Inavalid Password !'
                });
            }
            
        }else{
            return res.status(400).json({
                message: 'Something went wrong !'
            });
        }   
    });
}
exports.requireSignin = (req, res, next)=>{
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
}