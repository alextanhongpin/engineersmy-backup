# This program provides recommendation of similar github users based on skills

import json
from sklearn.feature_extraction import DictVectorizer
from sklearn import preprocessing
from sklearn.metrics.pairwise import euclidean_distances, pairwise_distances, manhattan_distances
from scipy.stats import pearsonr
import numpy as np

def euclidean (p1, p2):
    x1 = p1.reshape(1, -1)
    x2 = p2.reshape(1, -1)
    distance = euclidean_distances(x1, x2)[0][0]
    return 1 / (1 + distance)

print(euclidean(np.array([0,1]), np.array([1, 0])))

with open('data/recommendation/input.json') as in_json:
    data = json.load(in_json)
    print(len(data))
    labels = [] # The labels (username) you have
    values = [] # The values you have
    users_dict = {}
    for _, key in enumerate(data):
        users_dict[key['username']] = key
        values.append(key['languages'])
        labels.append(key['username'])
    
    # Takes an array of dictionary, and normalize them
    vectorizer = DictVectorizer(sparse=False)
    X = vectorizer.fit_transform(values)
    
    print(X)
    print('features:', vectorizer.get_feature_names())
    print('params:', vectorizer.get_params())
    recommendations = []
    for i1, x in enumerate(X):
        rec = {}
        rec['username'] = labels[i1]
        rec['matches'] = []
        rec['matches_info'] = []
        # Other arrays excluding itself
        other_labels = [l for l2, l in enumerate(labels) if l2 != i1]
        others = [a for i2, a in enumerate(X) if i2 != i1]
        matches_raw = euclidean_distances(np.array(x).reshape(1, -1), others)[0]
        matches = [1 / (m + 1) for m in matches_raw]
        top_five = sorted(matches, reverse=True)[:5]
        for _, i3 in enumerate(top_five):
            matches_index = matches.index(i3)
            # `Deprecate` the index
            matches[matches_index] = -9999
            rec['matches'].append(other_labels[matches_index])
            
        recommendations.append(rec)
    

    for _, user in enumerate(recommendations):
        print(user)
        user['matches_info'] = []
        for _, match in enumerate(user['matches']):
            user['matches_info'].append(users_dict[match])

    print(recommendations[0])
        
    with open('data/recommendation/output.json', 'w') as out_json:
        json.dump(recommendations, out_json)
    # for i, rec in enumerate(recommendations):
    #     if (rec['username'] == 'alextanhongpin'):
    #         print(i, rec, '\n')
    