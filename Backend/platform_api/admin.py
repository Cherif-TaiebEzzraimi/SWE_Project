# api/admin.py
from django.contrib import admin
from .models import (
    User, Admin, Client, Freelancer, 
    Skill, Category, Review, FAQ ,MediaFile , Report ,Notification , Help , JobInternshipOffer , Request
    , Negotiation , NegotiationFloatingComment , NegotiationPhase  , Project  , ProjectPhase , Deliverable  , Company )

admin.site.register(User)
admin.site .register(Admin)
admin.site.register(Client)
admin.site.register(Freelancer)
admin.site.register(Company)
admin.site.register(Skill)
admin.site.register(Category)
admin.site.register(Review)
admin.site.register(FAQ)
admin.site.register(MediaFile)
admin.site.register(Report)
admin.site.register(Notification)
admin.site.register(Help)
admin.site.register(JobInternshipOffer)
admin.site.register(Request)
admin.site.register(Negotiation)
admin.site.register(NegotiationFloatingComment)
admin.site.register(NegotiationPhase)
admin.site.register(Project)
admin.site.register(ProjectPhase)
admin.site.register(Deliverable)


