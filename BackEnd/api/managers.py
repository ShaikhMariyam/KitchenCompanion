from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
    use_in_migrations = True
    
    def create_user(self , email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, password):
       extra = {'is_staff':True,'is_superuser': True}
       return self.create_user(email, password, **extra)
