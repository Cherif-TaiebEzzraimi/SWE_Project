from rest_framework import serializers
from .models import (
    User, Admin, Company, Client, Freelancer,
    Skill, Category, Review, FAQ, MediaFile, Report, Notification,
    Help, JobInternshipOffer, Request,
    Negotiation, NegotiationPhase, NegotiationFloatingComment,
    Project, ProjectPhase, Deliverable,
    CommunityPost, CommunityComment, CommunityLike,
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
    user = UserSerializer(read_only=True)
    
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
    owner = UserSerializer(read_only=True)
    class Meta:
        model = MediaFile
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    class Meta:
        model = Report
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    receiver = UserSerializer(read_only=True)
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
    company = CompanySerializer(read_only=True)
    company_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = JobInternshipOffer
        fields = '__all__'
    
    def create(self, validated_data):
        # Company is passed from views, not from request data
        return super().create(validated_data)




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
    negotiation = NegotiationSerializer(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectPhaseSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    class Meta:
        model = ProjectPhase
        fields = '__all__'


class DeliverableSerializer(serializers.ModelSerializer):
    phase_detail = ProjectPhaseSerializer(source='phase', read_only=True)
    class Meta:
        model = Deliverable
        fields = '__all__'


# Community System Serializers =====================================================

class CommunityPostSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    comments_count = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityPost
        fields = ['id', 'owner', 'description', 'attachments', 'comments_count', 'likes_count', 'updated_at', 'created_at']
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_likes_count(self, obj):
        return obj.likes.count()


class CommunityCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityComment
        fields = ['id', 'post', 'user', 'parent', 'comment', 'replies_count', 'updated_at', 'created_at']
    
    def get_replies_count(self, obj):
        return obj.replies.count()


class CommunityCommentDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CommunityComment
        fields = ['id', 'post', 'user', 'parent', 'comment', 'replies', 'replies_count', 'updated_at', 'created_at']
    
    def get_replies(self, obj):
        # Get child comments (replies) for this comment
        child_comments = obj.replies.all()
        return CommunityCommentSerializer(child_comments, many=True).data
    
    def get_replies_count(self, obj):
        return obj.replies.count()


class CommunityLikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CommunityLike
        fields = ['id', 'post', 'user', 'created_at']