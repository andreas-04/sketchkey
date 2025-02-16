# services.py
from django.db import transaction

class ELOService:
    K_FACTOR = 32  # Adjust based on desired rating volatility
    
    @classmethod
    @transaction.atomic
    def update_ratings(cls, winner, losers):
        """Update ELO ratings for a match outcome"""
        for loser in losers:
            # Get expected scores
            expected_winner = 1 / (1 + 10 ** ((loser.elo_rating - winner.elo_rating) / 400))
            expected_loser = 1 - expected_winner
            
            # Update ratings
            winner.elo_rating += cls.K_FACTOR * (1 - expected_winner)
            loser.elo_rating += cls.K_FACTOR * (0 - expected_loser)
            
            # Update match counts
            winner.match_count += 1
            loser.match_count += 1
            
            # Save changes
            winner.save()
            loser.save()