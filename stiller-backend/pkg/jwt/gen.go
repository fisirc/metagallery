package jwt

import (
	"stiller"
    "github.com/kataras/jwt"
)

type Token struct {
    UserId int `json:"iss"`
}

func (tk *Token) Encode() ([]byte, error) {
    token, sign_err := jwt.Sign(jwt.HS256, stiller.StillerConfig.Secret, *tk)
    return token, sign_err
}

func Decode(str string) (Token, error) {
    ver_tk, ver_err := jwt.Verify(jwt.HS256, stiller.StillerConfig.Secret, []byte(str))
    if ver_err != nil {
        return Token{}, ver_err
    }

    new_tk := Token{}
    claims_err := ver_tk.Claims(&new_tk)
    if claims_err != nil {
        return Token{}, claims_err
    }

    return new_tk, nil
}




