1.User Creation
    Types:
    1.JobSeeker
    2.Recruiter
    3.College
    
        Models:-
            1.Login (Base Model)
    
            Reference
                1.JobSeeker (Reference Model)
                2.Recruiter (Reference Model)
                3.College   (Reference Model)
    
        Description:
            Once the User clicks the signup button, The necessary fields will be shown
        and will be saved in the database based on the "Base Model". It consist of name,password,email,authcode,isVerified. Based on the type of user the Reference Models can be used (eg. If an user signups as a jobseeker he will fill first the "Base Model" and then In the Refernce Model he will have refernce to "Jobseeker Model". He can fill the necessary fields in the "Job Seeker Model".)
    
        Routes:
    
        1."/auth/user -(SignUp) [POST] To create an User
            Fields To be Inserted.
             email,
             username,
             password,
             phone,
             role
    
        2. "/auth/verify/:token" -(Verification via Mail) [GET] This will be shared via Mail and Once the user clicks the Verification button the accounts gets verified
    
        3."/auth/login" - (Login) [POST] : This Route is used to login to the application
            NOTE: Only if the User is logged in it allows to login or it will get errors
            RESPONSE:
                1.UserID,
                2.Role
                3.Token
    
        4. Forgot Password Handlers
            1."/auth/reset"-(SendingOTP via Mail) [POST] Used to send the mail via email
                INPUTS:
                    1.email
    
            2."/auth/check"-(VerifyOTPMail)[POST] To check OTP that is Send via mail with the database
                INPUTS:
                    1.email
                OUTPUT:
                    1.STATUS CODE === (200)OTP IS CORRECT
                    2.STATUS CODE !== (200)OTP IS INCORRECT
    
            3."/auth/change"-(ChangePassword)[PUT] To Reset the Password
                INPUTS:
                    1.email
                    2.authCode(OTP)
                    3.password
                    4.confirmPassword
    