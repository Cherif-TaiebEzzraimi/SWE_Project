from rest_framework import serializers
from .models import (
    User, Admin, Company, Client, Freelancer,
    Skill, Category, Review, FAQ, MediaFile, Report, Notification,
    Help, JobInternshipOffer, Request,
    Negotiation, NegotiationPhase, NegotiationFloatingComment,
    Project, ProjectPhase, Deliverable,
    
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'

class FreelancerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Freelancer
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    client_id = ClientSerializer(read_only=True)
    freelancer_id = FreelancerSerializer(read_only=True)
    class Meta:
        model = Review
        fields = '__all__'


class MediaFileSerializer(serializers.ModelSerializer):
    owner_id = UserSerializer(read_only = True)
    class Meta:
        model = MediaFile
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    reporter_id = UserSerializer(read_only =True)
    class Meta:
        model = Report
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    receiver_id = UserSerializer(read_only = True)
    class Meta:
        model = Notification
        fields = '__all__'


class HelpSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Help
        fields = ['id', 'user', 'user_id', 'problem', 'created_at']


class JobInternshipOfferSerializer(serializers.ModelSerializer):
    company_id = CompanySerializer(read_only =True)

    class Meta:
        model = JobInternshipOffer
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)

    class Meta:
        model = Request
        fields = '__all__'


class NegotiationSerializer(serializers.ModelSerializer):
    request_id = RequestSerializer(read_only =True)
    client_id = ClientSerializer(read_only =True)
    freelancer_id = FreelancerSerializer(read_only =True)
    declined_by = UserSerializer(read_only = True)


    class Meta:
        model = Negotiation
        fields = '__all__'


class NegotiationPhaseSerializer(serializers.ModelSerializer):
    negotiation_id = NegotiationSerializer(read_only =True)
    class Meta:
        model = NegotiationPhase
        fields = '__all__'


class NegotiationFloatingCommentSerializer(serializers.ModelSerializer):
    negotiation_id = NegotiationSerializer(read_only =True)
    user_id = UserSerializer(read_only = True)



    class Meta:
        model = NegotiationFloatingComment
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    negotiation_id = NegotiationSerializer(read_only =True)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectPhaseSerializer(serializers.ModelSerializer):
    project_id = ProjectSerializer(read_only = True)
    class Meta:
        model = ProjectPhase
        fields = '__all__'


class DeliverableSerializer(serializers.ModelSerializer):
    phase_id = ProjectPhaseSerializer(read_only = True)
    class Meta:
        model = Deliverable
        fields = '__all__'

