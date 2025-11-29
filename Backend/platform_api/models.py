from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.validators import FileExtensionValidator


# Custom User Manager

class UserManager(BaseUserManager):
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
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


# Base User Model
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    ]
    
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


# Admin Model -------------------------------------------
class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='admin_profile')
    profile_picture = models.ImageField(upload_to='user_photos/', null=True, blank=True)

    phone_number = models.CharField(max_length=15, blank=True, null=True)
    
    class Meta:
        db_table = 'admins'
    
    def __str__(self):
        return f"Admin: {self.user.email}"


# Company Model --------------------------------------------
class Company(models.Model):
    user= models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    registration_number = models.CharField(max_length=120, unique=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    representative = models.TextField(max_length=65535, blank=True, null=True)
    business_type = models.CharField(max_length=50, blank=True, null=True)
    logo = models.ImageField(upload_to='Company_logos/', null=True, blank=True)

    description = models.TextField(max_length=65535, blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'companies'
        verbose_name_plural = 'Companies'
    
    def __str__(self):
        return f"Company: {self.user.email}"


# Client Model -----------------------------------------
class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='client_profile')
    profile_picture = models.ImageField(upload_to='user_photos/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    city = models.CharField(max_length=120, blank=True, null=True)
    wilaya = models.CharField(max_length=120, blank=True, null=True)
    
    class Meta:
        db_table = 'clients'
    
    def __str__(self):
        return f"Client: {self.user.email}"


# Freelancer Model ------------------------
class Freelancer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='freelancer_profile')
    profile_picture = models.ImageField(upload_to='user_photos/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    description = models.TextField(max_length=65535, blank=True, null=True)
    categories = models.JSONField(blank=True, null=True)  
    skills = models.JSONField(blank=True, null=True)  
    city = models.CharField(max_length=120, blank=True, null=True)
    wilaya = models.CharField(max_length=120, blank=True, null=True)
    years_experience = models.IntegerField(blank=True, null=True)
    national_id = models.CharField(max_length=50, blank=True, null=True)
    social_links = models.JSONField(blank=True, null=True) 
    rate = models.FloatField(
        blank=True, 
        null=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)],
        help_text="Rating on 5 stars scale (decimal [0, 2])"
    )
    education = models.JSONField(blank=True, null=True)
    ccp_account = models.CharField(max_length=50, blank=True, null=True)
    barid_account = models.CharField(max_length=50, blank=True, null=True)
    cvatta = models.CharField(max_length=255, blank=True, null=True)
    
    class Meta:
        db_table = 'freelancers'
    
    def __str__(self):
        return f"Freelancer: {self.user.email}"

# FAQ Model ----------------------------------------------
class FAQ(models.Model):
    """Frequently Asked Questions"""
    question = models.TextField()
    answer = models.TextField(max_length=65535)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'faq'
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.question[:50] + '...' if len(self.question) > 50 else self.question



# Skill Model ----------------------------------------------

class Skill(models.Model):
    """Skills that freelancers can have"""
    name = models.CharField(max_length=100, unique=True)
    
    class Meta:
        db_table = 'skills'
        ordering = ['name']
    
    def __str__(self):
        return self.name


# Category Model ----------------------------------------------


class Category(models.Model):
    """Categories for freelancer profiles"""
    name = models.CharField(max_length=120)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name
    

# Review Model ----------------------------------------------

class Review(models.Model):
    """Reviews given by clients to freelancers"""
    client= models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='reviews_given'
    )
    freelancer = models.ForeignKey(
        Freelancer,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    feedback = models.TextField(max_length=65535, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        unique_together = ['client', 'freelancer']  
    
    def __str__(self):
        return f"Review by {self.client.user.username} for {self.freelancer.user.username} - {self.rating}★"
    
    def save(self, *args, **kwargs):
        """Override save to update freelancer rating"""
        super().save(*args, **kwargs)
        self.freelancer_id.update_rating()




# Media Files Model ----------------------------------------------
class MediaFile(models.Model):
    """Generic media file storage for any entity"""

    ENTITY_TYPE_CHOICES = [
        ('freelancer_cv', 'Freelancer CV'),
        ('company_document', 'Company Document'),
        ('job_attachment', 'Job Attachment'),
        ('request_attachment', 'Request Attachment'),
        ('negotiation_attachment', 'Negotiation Attachment'),
        ('phase_deliverable', 'Phase Deliverable'),
    ]
    
    owner = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='media_files'
    )
    entity_type = models.CharField(max_length=50, choices=ENTITY_TYPE_CHOICES)
    entity_id = models.IntegerField()
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    file_url = models.TextField(max_length=65535, help_text="URL or path to the file")
    file_type = models.CharField(max_length=50, help_text="MIME type or file extension")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'media_files'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['entity_type', 'entity_id']),
            models.Index(fields=['owner', 'created_at']),
        ]
    
    def __str__(self):
        return f"Media: {self.file_type} for {self.entity_type} ({self.entity_id})"


# Reports Model ---------------------------------------------

class Report(models.Model):
    """Reports submitted by users about content or other users"""
    REPORT_TYPE_CHOICES = [
        ('client', 'Client Report'),
        ('post', 'Post Report'),
        ('comment', 'Comment Report'),
        ('freelancer', 'Freelancer Report'),
        ('request', 'Request Report'),
    ]
    
    reporter = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='reports_made'
    )
    type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    target_id = models.IntegerField(help_text="ID of the reported entity")
    text = models.TextField(max_length=65535, help_text="Description of the report")
    created_at = models.DateTimeField(auto_now_add=True)
    
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    reported_object = GenericForeignKey('content_type', 'object_id')
    
    class Meta:
        db_table = 'reports'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type', 'created_at']),
            models.Index(fields=['reporter', 'created_at']),
        ]
    
    def __str__(self):
        return f"Report by {self.reporter.username}: {self.type} (ID: {self.target_id})"


# Notifications Model -----------------------------------------------


class Notification(models.Model):
    """Notifications for users"""
    receiver = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    content = models.TextField(max_length=65535)
    seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['receiver', 'seen', 'created_at']),
        ]
    
    def __str__(self):
        status = "Read" if self.seen else "Unread"
        return f"Notification for {self.receiver.username} - {status}"
    
    def mark_as_read(self):
        """Mark notification as read"""
        self.seen = True
        self.save()



# Help Model  --------------------------------------------
class Help(models.Model):
    """Help/Support tickets submitted by users"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
    ]
    
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='help_tickets'
    )
    problem = models.TextField(max_length=65535, help_text="Description of the problem")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'help'
        verbose_name = 'Help Ticket'
        verbose_name_plural = 'Help Tickets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def __str__(self):
        return f"Help #{self.id} - {self.user.username} ({self.status})"
    
    def resolve(self):
        """Mark ticket as resolved"""
        self.status = 'resolved'
        self.save()
    
    def close(self):
        """Close the ticket"""
        self.status = 'closed'
        self.save()

# Job and Internship Offer Model --------------------------------------------

class JobInternshipOffer(models.Model):
    """Job and internship offers posted by companies"""
    OFFER_TYPE_CHOICES = [
        ('job', 'Job'),
        ('internship', 'Internship'),
    ]
    
    company = models.ForeignKey(
        'Company',
        on_delete=models.CASCADE,
        related_name='job_offers'
    )
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=OFFER_TYPE_CHOICES)
    requirements = models.TextField(max_length=65535, help_text="Job requirements and qualifications")
    duration = models.CharField(max_length=120, blank=True, null=True, help_text="e.g., '3 months', '1 year', 'Permanent'")
    what_we_offer = models.TextField(max_length=65535, blank=True, null=True, help_text="Benefits and what the company offers")
    attachments = models.FileField(upload_to='company_attachments/',
    validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])], blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'job_internship_offers'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company', 'type', 'created_at']),
            models.Index(fields=['type', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.type}) - {self.company.user.username}"


# Request Model --------------------------------------------

class Request(models.Model):
    """Service requests submitted by clients"""
    STATUS_CHOICES = [
        ('accepted', 'Accepted'),
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('rejected', 'Rejected'),
    ]
    
    client = models.ForeignKey(
        'Client',
        on_delete=models.CASCADE,
        related_name='requests'
    )
    title = models.TextField(max_length=65535)
    attachments = models.JSONField(
        blank=True,
        null=True,
        help_text="Store attachment URLs/paths as JSON array"
    )
    category = models.CharField(max_length=120, blank=True, null=True)
    budget_min = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Minimum budget"
    )
    budget_max = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Maximum budget"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'requests'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['client', 'status', 'created_at']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['category', 'created_at']),
        ]
    
    def __str__(self):
        return f"Request #{self.id} by {self.client.user.username} - {self.status}"


# Negotiation Model --------------------------------------------

class Negotiation(models.Model):
    """Negotiations between clients and freelancers"""
    ORIGIN_TYPE_CHOICES = [
        ('direct_hire', 'Direct Hire'),
        ('request', 'Request'),
        ('job_offer', 'Job Offer'),
    ]
    
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('agreed', 'Agreed'),
        ('completed', 'Completed'),
        ('declined', 'Declined'),
    ]
    
    origin_type = models.CharField(
        max_length=20,
        choices=ORIGIN_TYPE_CHOICES,
        help_text="How the negotiation was initiated"
    )
    request = models.ForeignKey(
        'Request',
        on_delete=models.CASCADE,
        related_name='negotiations',
        blank=True,
        null=True,
        help_text="Related request if origin_type is 'request'"
    )
    client = models.ForeignKey(
        'Client',
        on_delete=models.CASCADE,
        related_name='negotiations_as_client'
    )
    freelancer = models.ForeignKey(
        'Freelancer',
        on_delete=models.CASCADE,
        related_name='negotiations_as_freelancer'
    )
    client_description = models.TextField(max_length=65535, blank=True, null=True)
    client_attachments = models.JSONField(blank=True, null=True)
    client_agreed = models.BooleanField(default=False)
    freelancer_attachments = models.JSONField(blank=True, null=True)
    freelancer_agreed = models.BooleanField(default=False)
    declined_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='negotiations_declined'
    )
    decline_reason = models.TextField(max_length=65535, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'negotiations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['client', 'status', 'created_at']),
            models.Index(fields=['freelancer', 'status', 'created_at']),
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['origin_type', 'created_at']),
        ]
    
    def __str__(self):
        return f"Negotiation #{self.id}: {self.client.user.username} ↔ {self.freelancer.user.username} ({self.status})"
    
    def is_agreed(self):
        """Check if both parties agreed"""
        return self.client_agreed and self.freelancer_agreed


# Negotiation Phases Model --------------------------------------------

class NegotiationPhase(models.Model):
    """Phases/milestones within a negotiation"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('approved', 'Approved'),
        ('revision_required', 'Revision Required'),
    ]
    
    negotiation = models.ForeignKey(
        'Negotiation',
        on_delete=models.CASCADE,
        related_name='phases'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=65535, blank=True, null=True)
    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    deadline = models.DateField(blank=True, null=True)
    deliverables = models.TextField(max_length=65535, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'negotiation_phases'
        ordering = ['negotiation', 'created_at']
        indexes = [
            models.Index(fields=['negotiation', 'status']),
            models.Index(fields=['deadline']),
        ]
    
    def __str__(self):
        return f"Phase: {self.title} (Negotiation #{self.negotiation.id}) - {self.status}"


# Negotiation Floating Comments Model --------------------------------------------
class NegotiationFloatingComment(models.Model):
    """Comments/messages within a negotiation"""
    STATUS_CHOICES = [
        ('pending ', 'Pending'),
        ('resolved', 'Resolved')
    ]
    
    negotiation = models.ForeignKey(
        'Negotiation',
        on_delete=models.CASCADE,
        related_name='floating_comments'
    )
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='negotiation_comments'
    )
    comment = models.TextField(max_length=65535)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='replies',
        help_text="For threaded/nested comments"
    )
  
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'negotiation_floating_comments'
        ordering = ['negotiation_id', 'created_at']
        indexes = [
            models.Index(fields=['negotiation', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['parent']),
        ]
    
    def __str__(self):
        return f"Comment by {self.user.username} on Negotiation #{self.negotiation.id}"


# Project Model -------------------------------------------

class Project(models.Model):
    """Projects created from accepted negotiations"""
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    
    negotiation = models.OneToOneField(
        'Negotiation',
        on_delete=models.CASCADE,
        related_name='project',
        help_text="The negotiation that created this project"
    )
    title = models.CharField(max_length=255)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'projects'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['negotiation']),
            models.Index(fields=['start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"Project: {self.title} (Negotiation #{self.negotiation.id})"
    
    @property
    def client(self):
        """Get client from negotiation"""
        return self.negotiation.client
    
    @property
    def freelancer(self):
        """Get freelancer from negotiation"""
        return self.negotiationfreelancer



# Project Phases Model ----------------------------------------
class ProjectPhase(models.Model):
    """Phases/milestones within a project"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('waiting_client_review', 'Waiting For Client Review'),
        ('done', 'Done'),
    ]
    
    project = models.ForeignKey(
        'Project',
        on_delete=models.CASCADE,
        related_name='phases'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=65535, blank=True, null=True)
    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )
    estimated_duration = models.IntegerField(
        blank=True,
        null=True,
        help_text="Estimated duration in days"
    )
    deliverables = models.TextField(max_length=65535, blank=True, null=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'project_phases'
        ordering = ['project', 'created_at']
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['status', 'created_at']),
        ]
    
    def __str__(self):
        return f"Phase: {self.title} (Project: {self.project.title}) - {self.status}"


# Project Deliverables Model ----------------------------------------
class Deliverable(models.Model):
    """Deliverables for project phases"""
    
    phase= models.ForeignKey(
        'ProjectPhase',
        on_delete=models.CASCADE,
        related_name='deliverable_items'
    )
    attachment = models.CharField(max_length=255, blank=True, null=True)
    textcontent = models.TextField(max_length=65535, blank=True, null=True)
    submitted_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'deliverables'
        ordering = ['phase', 'submitted_at']
        indexes = [
            models.Index(fields=['phase', 'submitted_at']),
        ]
    
    def __str__(self):
        return f"Deliverable: (Phase: {self.phase.title}) - {self.status}"
