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


class FreelancerListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='pk')
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    bio = serializers.CharField(source='description', allow_blank=True, allow_null=True)
    category = serializers.SerializerMethodField()
    skills = serializers.SerializerMethodField()
    rating = serializers.FloatField(source='rate', allow_null=True)

    def get_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip()
        return ""
    def get_avatar(self, obj):
        if obj.profile_picture:
            return obj.profile_picture.url if hasattr(obj.profile_picture, 'url') else obj.profile_picture
        return None
    def get_category(self, obj):
        # Return first category if categories is a list, else blank
        if isinstance(obj.categories, list) and obj.categories:
            return obj.categories[0]
        if isinstance(obj.categories, str):
            return obj.categories
        return ''
    def get_skills(self, obj):
        if isinstance(obj.skills, list):
            return obj.skills
        if isinstance(obj.skills, str):
            return [obj.skills]
        return []

    class Meta:
        model = Freelancer
        fields = ['id', 'name', 'avatar', 'bio', 'category', 'skills', 'rating']


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
    request = RequestSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    freelancer = FreelancerSerializer(read_only=True)
    request_id = serializers.IntegerField(write_only=True, required=False)
    client_id = serializers.IntegerField(write_only=True, required=False)
    freelancer_id = serializers.IntegerField(write_only=True, required=False)
    declined_by = UserSerializer(read_only = True)


    class Meta:
        model = Negotiation
        fields = '__all__'
    
    def create(self, validated_data):
        # Handle request_id, client_id and freelancer_id if provided
        request_id = validated_data.pop('request_id', None)
        client_id = validated_data.pop('client_id', None)
        freelancer_id = validated_data.pop('freelancer_id', None)
        
        # Get request, client and freelancer objects
        if request_id:
            validated_data['request'] = Request.objects.get(pk=request_id)
        if client_id:
            # Client uses user as primary key, so client_id is actually user_id
            validated_data['client'] = Client.objects.get(pk=client_id)
        if freelancer_id:
            # Freelancer uses user as primary key, so freelancer_id is actually user_id
            validated_data['freelancer'] = Freelancer.objects.get(pk=freelancer_id)
        
        return super().create(validated_data)


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