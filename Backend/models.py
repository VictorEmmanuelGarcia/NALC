from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(blank=True, default='', unique=True , max_length=30)
    name = models.CharField(max_length=255, blank=True, default='')

    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email
        
    def get_full_name(self):
        return self.name

# research paper model
class researchpaper(models.Model):
    TITLE_CHOICES = (
        (1, 'Proposal'),
        (2, 'Thesis/Research'),
        (3, 'Project'),
    )

    CLASSIFICATION_CHOICES = (
        (1, 'Basic Research'),
        (2, 'Applied Research'),
    )

    title = models.CharField(max_length=255)
    abstract = models.TextField()
    year = models.IntegerField()
    record_type = models.IntegerField(choices=TITLE_CHOICES)
    classification = models.IntegerField(choices=CLASSIFICATION_CHOICES)
    psc_ed = models.CharField(max_length=255)
    author = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Thread(models.Model):
    thread_id = models.AutoField(primary_key=True)
    thread_name = models.CharField(max_length=255)

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    message_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)